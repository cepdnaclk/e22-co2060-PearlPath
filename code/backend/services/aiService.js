let GoogleGenerativeAI = null;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (err) {
  console.warn('[AI Service] @google/generative-ai module not loaded');
}

let OpenAI = null;
try {
  OpenAI = require('openai');
} catch (err) {
  console.warn('[AI Service] openai module not loaded');
}

const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const TourGuide = require('../models/TourGuide');
const User = require('../models/User');
const mongoose = require('mongoose');

let FAQ;
try {
  FAQ = mongoose.model('FAQ');
} catch (e) {
  try {
    FAQ = require('../models/FAQ');
  } catch (err) {
    const faqSchema = new mongoose.Schema({ question: String, answer: String });
    faqSchema.index({ question: 'text', answer: 'text' });
    FAQ = mongoose.model('FAQ', faqSchema);
  }
}

// Initialize clients if keys are present
let genAI = null;
if (process.env.GEMINI_API_KEY && GoogleGenerativeAI) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

let openaiClient = null;
if (process.env.OPENAI_API_KEY && OpenAI) {
  try {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (err) {
    console.error('[AI Service] Failed to initialize OpenAI client:', err);
  }
}

const SRI_LANKA_LOCATIONS = ['Ella', 'Galle', 'Kandy', 'Colombo', 'Negombo', 'Jaffna', 'Sigiriya', 'Bentota', 'Hikkaduwa', 'Mirissa', 'Nuwara Eliya', 'Dambulla', 'Trincomalee'];

function extractLocation(message) {
  const msg = message.toLowerCase();
  for (const loc of SRI_LANKA_LOCATIONS) {
    if (msg.includes(loc.toLowerCase())) {
      return loc;
    }
  }
  return null;
}

function localRuleChatbot(message, contextData, userProfile = null) {
  const msg = message.toLowerCase();
  const userName = userProfile ? userProfile.firstName : "";
  const greeting = userName ? `Ayubowan, ${userName}! 🌅` : `Ayubowan! 🌅`;
  
  if (!contextData) {
    return `${greeting} Welcome to **PearlPath**, your premium guide to Sri Lanka! 

I am **Traver**, your travel assistant. Currently, my cloud AI services are running locally in demonstration mode. 

I can still help you browse the website and find great travel spots! Here are some things you can ask me:
- **"Recommend hotels"** (Find luxury accommodation)
- **"Find tour guides"** (Hire local experts)
- **"Check my bookings"** (View reservations)
- **"Show website help"** (Learn how to use PearlPath)

How would you like to start your journey today? 🇱🇰`;
  }

  const { type, data } = contextData;

  if (type === 'hotels') {
    if (data && data.length > 0) {
      const hotelList = data.map(h => `• **${h.name}** in *${h.location}* — $${h.pricePerNight}/night (${h.starRating}⭐)`).join('\n');
      return `I found some top-rated hotels in Sri Lanka for you, ${userName || 'traveler'}! 🏨

${hotelList}

You can browse them in the carousel below and click **"View Hotel"** to check rooms, amenities, and book online!`;
    } else {
      return `I couldn't find any hotels matching your criteria right now, ${userName || 'traveler'}. 

Try checking our [Hotels Catalog](/hotels) to view all current listings!`;
    }
  }

  if (type === 'guides') {
    if (data && data.length > 0) {
      const guideList = data.map(g => `• **${g.name}** in *${g.location}* — $${g.pricePerDay || 30}/day (${g.experienceYears || 2} years exp)`).join('\n');
      return `Here are some of our professional local tour guides available to show you around Sri Lanka! 🗺️

${guideList}

Check out their profiles in the carousel below to contact them or read reviews.`;
    } else {
      return `We don't have guides listed in that specific location yet, ${userName || 'traveler'}. 

Browse our complete [Tour Guides Directory](/tour-guides) to find guides across Sri Lanka!`;
    }
  }

  if (type === 'tours') {
    if (data && data.length > 0) {
      const tourList = data.map(t => `• **${t.title}** in *${t.location}* — $${t.price} (${t.duration})`).join('\n');
      return `Here are some curated Sri Lankan tours and adventures for you! 🌴

${tourList}

Select a tour from the list below to view the itinerary and start booking!`;
    } else {
      return `I couldn't find any specific tours right now, ${userName || 'traveler'}. 

Head over to our [Experiences](/experiences) page to view popular travel packages!`;
    }
  }

  if (type === 'bookings') {
    if (data && data.length > 0) {
      const bookingList = data.map(b => `• Booking **#${b._id.toString().slice(-6)}** — Status: **${b.bookingStatus}**`).join('\n');
      return `Here are your recent booking details, ${userName || 'traveler'}: 📅

${bookingList}

Visit your [My Bookings Dashboard](/my-bookings) to modify, cancel, or view invoice details.`;
    } else {
      return `You don't have any bookings registered with this account yet, ${userName || 'traveler'}. 

Find a hotel under [Hotels](/hotels) or list your own service!`;
    }
  }

  if (type === 'faqs') {
    if (data && data.length > 0) {
      const faqList = data.map(f => `**Q: ${f.question}**\n*A: ${f.answer}*`).join('\n\n');
      return `Here is what I found regarding your questions, ${userName || 'traveler'}: ℹ️

${faqList}

If you need more help, feel free to contact our support desk!`;
    } else {
      return `Here are some quick platform instructions, ${userName || 'traveler'}:

- **Register as Hotel Owner / Guide**: Click the "Register" button on the top right, select the appropriate account type, and fill the signup form.
- **Bookings**: Navigate to Hotels, select a property, choose your dates, and click "Book Now".`;
    }
  }

  if (type === 'navigation') {
    return `Here are quick shortcuts to different pages on PearlPath: 🧭

- [Go to Home Page](/)
- [Browse Hotels](/hotels)
- [Find Tour Guides](/tour-guides)
- [Check My Bookings](/my-bookings)
- [Update Profile](/profile)
- [Explore Experiences](/experiences)

Let me know if you need help finding anything else, ${userName || 'traveler'}!`;
  }

  return `Ayubowan${userName ? ' ' + userName : ''}! How can I help you plan your vacation in Sri Lanka today? 🇱🇰`;
}

async function getIntent(message) {
  try {
    const validIntents = [
      "tour_recommendation",
      "hotel_recommendation",
      "tour_guide_recommendation",
      "booking_status",
      "faq",
      "navigation_help",
      "general_chat"
    ];

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `Classify the user's message into exactly one of these categories:
- tour_recommendation
- hotel_recommendation
- tour_guide_recommendation
- booking_status
- faq
- navigation_help
- general_chat

Reply ONLY with the exact string of the category, nothing else.

Message: ${message}`;
      
      const result = await model.generateContent(prompt);
      const intent = result.response.text().trim();
      return validIntents.includes(intent) ? intent : "general_chat";
    } else if (openaiClient) {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Classify the user's message into exactly one of these categories:
- tour_recommendation
- hotel_recommendation
- tour_guide_recommendation
- booking_status
- faq
- navigation_help
- general_chat

Reply ONLY with the exact string of the category, nothing else.`
          },
          { role: "user", content: message }
        ],
        temperature: 0,
        max_tokens: 15
      });
      const intent = response.choices[0].message.content.trim();
      return validIntents.includes(intent) ? intent : "general_chat";
    } else {
      // Local keyword matching fallback
      const msg = message.toLowerCase();
      if (msg.includes('hotel') || msg.includes('stay') || msg.includes('room') || msg.includes('resort') || msg.includes('accommodation') || msg.includes('place to stay')) {
        return "hotel_recommendation";
      }
      if (msg.includes('guide') || msg.includes('driver') || msg.includes('hire') || msg.includes('escort') || msg.includes('person')) {
        return "tour_guide_recommendation";
      }
      if (msg.includes('tour') || msg.includes('trip') || msg.includes('package') || msg.includes('itinerary') || msg.includes('adventure')) {
        return "tour_recommendation";
      }
      if (msg.includes('booking') || msg.includes('status') || msg.includes('reservation') || msg.includes('my plan')) {
        return "booking_status";
      }
      if (msg.includes('how') || msg.includes('faq') || msg.includes('question') || msg.includes('register') || msg.includes('sign up') || msg.includes('help')) {
        return "faq";
      }
      if (msg.includes('navigate') || msg.includes('go to') || msg.includes('page') || msg.includes('menu') || msg.includes('tabs') || msg.includes('screen')) {
        return "navigation_help";
      }
      return "general_chat";
    }
  } catch (error) {
    console.error("Error in intent detection:", error);
    return "general_chat";
  }
}

async function retrieveContext(intent, message, userId) {
  let context = null;
  
  try {
    const location = extractLocation(message);
    const matches = message.match(/\$?\d+/g);
    const budget = matches ? Math.max(...matches.map(m => parseInt(m.replace('$', '')))) : null;

    switch (intent) {
      case "tour_recommendation": {
        let query = { status: 'approved', isAvailable: true };
        if (budget) {
          query.price = { $lte: budget };
        }
        if (location) {
          query.$or = [
            { location: new RegExp(location, 'i') },
            { title: new RegExp(location, 'i') },
            { description: new RegExp(location, 'i') }
          ];
        }
        
        let tours = await Tour.find(query).limit(5).lean();
        if (tours.length === 0) {
          tours = await Tour.find(budget ? { price: { $lte: budget } } : {}).limit(5).lean();
        }
        context = { type: 'tours', data: tours };
        break;
      }

      case "hotel_recommendation": {
        let query = { status: 'approved' };
        if (budget) {
          query.pricePerNight = { $lte: budget };
        }
        if (location) {
          query.$or = [
            { location: new RegExp(location, 'i') },
            { name: new RegExp(location, 'i') },
            { description: new RegExp(location, 'i') }
          ];
        }

        let hotels = await Hotel.find(query).limit(5).lean();
        if (hotels.length === 0) {
          hotels = await Hotel.find(budget ? { pricePerNight: { $lte: budget } } : {}).limit(5).lean();
        }
        context = { type: 'hotels', data: hotels };
        break;
      }

      case "tour_guide_recommendation": {
        let query = {};
        if (location) {
          query.$or = [
            { location: new RegExp(location, 'i') },
            { name: new RegExp(location, 'i') },
            { bio: new RegExp(location, 'i') }
          ];
        }

        let guides = await TourGuide.find(query).limit(5).lean();
        if (guides.length === 0) {
          guides = await TourGuide.find({}).limit(5).lean();
        }
        context = { type: 'guides', data: guides };
        break;
      }
      
      case "booking_status": {
        if (userId) {
          const bookings = await Booking.find({ user: userId }).populate('tour hotel').lean();
          context = { type: 'bookings', data: bookings };
        } else {
          const bookings = await Booking.find().limit(2).populate('tour hotel').lean();
          context = { type: 'bookings', data: bookings, note: 'Showing demo bookings' };
        }
        break;
      }
      
      case "faq": {
        let faqs = [];
        try {
          faqs = await FAQ.find({ $text: { $search: message } }).limit(3).lean();
        } catch (e) {
          const words = message.split(' ').filter(w => w.length > 3);
          const regexQueries = words.map(w => ({ question: new RegExp(w, 'i') }));
          if (regexQueries.length > 0) {
            faqs = await FAQ.find({ $or: regexQueries }).limit(3).lean();
          } else {
            faqs = await FAQ.find().limit(3).lean();
          }
        }
        context = { type: 'faqs', data: faqs };
        break;
      }
      
      case "navigation_help": {
        context = {
          type: 'navigation',
          data: {
            Home: '/',
            Tours: '/tours',
            Hotels: '/hotels',
            Bookings: '/my-bookings',
            Profile: '/profile',
            Experiences: '/experiences',
            'Tour Guides': '/tour-guides'
          }
        };
        break;
      }
      
      case "general_chat":
      default:
        context = null;
        break;
    }
  } catch (error) {
    console.error("Error retrieving context:", error);
  }
  
  return context;
}

async function generateResponse(message, conversationHistory, contextData, userProfile = null) {
  try {
    let contextString = "";
    if (contextData && contextData.data && contextData.data.length > 0) {
      contextString = `\n\nContext Information (Use this to answer factual questions if relevant):\n${JSON.stringify(contextData, null, 2)}`;
    }

    const userName = userProfile ? userProfile.firstName : "traveler";
    const systemPrompt = `[System Instructions: You are Traver, a friendly and professional Sri Lanka travel agent working for PearlPath. Your goal is to help users with their travel plans in Sri Lanka.
    
You are speaking to a user named "${userName}". Address them as such when appropriate (e.g. at the start of conversation or greetings).

**Platform Help Guidelines:**
If the user asks how to use the website, provide these instructions:
- **To register as a hotel owner / service provider:** Click "Sign Up" or "Register" at the top right, select the account type during registration, and fill in their details to list their properties.
- **To book a hotel or tour:** Go to the "Hotels" or "Tours" tab, browse or search, click on the item, and click the "Book Now" button.
- **To view bookings:** Log in and visit the "Profile" or "My Bookings" dashboard.

Answer factual claims ONLY from the given Context Information. If the context information does not cover it, do not guess. Instead, politely say "Let me connect you with support for more specific details." Maintain a warm, welcoming tone. Keep responses concise and helpful.]${contextString}`;

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      let sanitizedHistory = [];
      let lastRole = null;
      const recentHistory = conversationHistory.slice(-6);
      
      for (const msg of recentHistory) {
        const role = msg.role === 'user' ? 'user' : 'model';
        if (role !== lastRole) {
           sanitizedHistory.push({ role, parts: [{ text: msg.content || " " }] });
           lastRole = role;
        } else {
           if (sanitizedHistory.length > 0) {
              sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += "\n" + (msg.content || " ");
           }
        }
      }
      
      while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
         sanitizedHistory.shift();
      }

      const chat = model.startChat({
        history: sanitizedHistory
      });

      const fullMessage = `${systemPrompt}\n\nUser Message: ${message}`;
      const result = await chat.sendMessage(fullMessage);
      return result.response.text();
    } else if (openaiClient) {
      const messages = [
        { role: "system", content: systemPrompt }
      ];
      
      const recentHistory = conversationHistory.slice(-6);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content || " "
        });
      }
      messages.push({ role: "user", content: message });

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7
      });
      return response.choices[0].message.content;
    } else {
      return localRuleChatbot(message, contextData, userProfile);
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return localRuleChatbot(message, contextData, userProfile);
  }
}

async function handleChatMessage(message, conversationHistory = [], userId = null) {
  try {
    let userProfile = null;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        userProfile = await User.findById(userId).lean();
      } catch (err) {
        console.error("Error fetching user for chatbot profile:", err.message);
      }
    }

    const intent = await getIntent(message);
    const context = await retrieveContext(intent, message, userId);
    const reply = await generateResponse(message, conversationHistory, context, userProfile);
    
    return { reply, context };
  } catch (error) {
    console.error("Chat error:", error);
    return {
      reply: "I sincerely apologize, but I'm having trouble connecting to my systems right now. Please try again in a moment.",
      context: null
    };
  }
}

module.exports = {
  getIntent,
  retrieveContext,
  generateResponse,
  handleChatMessage
};
