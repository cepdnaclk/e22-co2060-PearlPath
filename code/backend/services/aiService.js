const { GoogleGenerativeAI } = require('@google/generative-ai');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
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

let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

async function getIntent(message) {
  try {
    if (!genAI) return "general_chat";
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Classify the user's message into exactly one of these categories:
- tour_recommendation
- booking_status
- faq
- navigation_help
- general_chat

Reply ONLY with the exact string of the category, nothing else.

Message: ${message}`;
    
    const result = await model.generateContent(prompt);
    const intent = result.response.text().trim();
    
    const validIntents = ["tour_recommendation", "booking_status", "faq", "navigation_help", "general_chat"];
    return validIntents.includes(intent) ? intent : "general_chat";
  } catch (error) {
    console.error("Error in intent detection:", error);
    return "general_chat";
  }
}

async function retrieveContext(intent, message, userId) {
  let context = null;
  
  try {
    switch (intent) {
      case "tour_recommendation": {
        const matches = message.match(/\$?\d+/g);
        const budget = matches ? Math.max(...matches.map(m => parseInt(m.replace('$', '')))) : null;
        
        let query = {};
        if (budget) {
          query.price = { $lte: budget };
        }
        
        const tours = await Tour.find(query).limit(5).lean();
        context = { type: 'tours', data: tours };
        break;
      }
      
      case "booking_status": {
        if (userId) {
          const bookings = await Booking.find({ user: userId }).populate('tour hotel').lean();
          context = { type: 'bookings', data: bookings };
        } else {
          context = { type: 'bookings', error: 'User not logged in' };
        }
        break;
      }
      
      case "faq": {
        const faqs = await FAQ.find({ $text: { $search: message } })
          .limit(3)
          .lean();
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
            Bookings: '/bookings',
            Profile: '/profile',
            Contact: '/contact'
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

async function generateResponse(message, conversationHistory, contextData) {
  try {
    if (!genAI) throw new Error("Gemini is not initialized");
    let contextString = "";
    if (contextData) {
      contextString = `\n\nContext Information (Use this to answer factual questions if relevant):\n${JSON.stringify(contextData, null, 2)}`;
    }

    const systemPrompt = `[System Instructions: You are Traver, a friendly and professional Sri Lanka travel agent working for PearlPath. Your goal is to help users with their travel plans in Sri Lanka.
    
**Platform Help Guidelines:**
If the user asks how to use the website, provide these instructions:
- **To register as a hotel owner / service provider:** Tell them to click "Sign Up" or "Register" at the top right, select the "Service Provider" or "Hotel Owner" account type during registration, and fill in their details to list their properties.
- **To book a hotel or tour:** Tell them to navigate to the "Hotels" or "Tours" tab, browse or search for what they like, click on the item to view details, select their dates, and click the "Book Now" button.
- **To view bookings:** Tell them to log in and visit their "Profile" or "My Bookings" dashboard.

Answer factual claims ONLY from the given Context Information. If the context information does not cover it, do not guess. Instead, politely say "Let me connect you with support for more specific details." Maintain a warm, welcoming tone. Keep responses concise and helpful.]${contextString}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let sanitizedHistory = [];
    let lastRole = null;
    
    // Take the last 6 turns
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
    
    // Ensure it starts with 'user'
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
       sanitizedHistory.shift();
    }

    const chat = model.startChat({
      history: sanitizedHistory
    });

    const fullMessage = `${systemPrompt}\n\nUser Message: ${message}`;
    const result = await chat.sendMessage(fullMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

async function handleChatMessage(message, conversationHistory = [], userId = null) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "I'm sorry, my AI features are currently unconfigured. Please try again later.";
    }

    const intent = await getIntent(message);
    const context = await retrieveContext(intent, message, userId);
    const reply = await generateResponse(message, conversationHistory, context);
    
    return reply;
  } catch (error) {
    console.error("Chat error:", error);
    return "I sincerely apologize, but I'm having trouble connecting to my systems right now. Please try again in a moment.";
  }
}

module.exports = {
  getIntent,
  retrieveContext,
  generateResponse,
  handleChatMessage
};
