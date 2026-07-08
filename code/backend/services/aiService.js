const { OpenAI } = require('openai');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
// require FAQ if it exists, otherwise define a dummy or use mongoose.model('FAQ')
const mongoose = require('mongoose');
let FAQ;
try {
  FAQ = mongoose.model('FAQ');
} catch (e) {
  // If not already registered, try requiring or define schema
  try {
    FAQ = require('../models/FAQ');
  } catch (err) {
    const faqSchema = new mongoose.Schema({ question: String, answer: String });
    FAQ = mongoose.model('FAQ', faqSchema);
  }
}

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function getIntent(message) {
  try {
    if (!openai) return "general_chat";
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Classify the user's message into exactly one of these categories:
- tour_recommendation
- booking_status
- faq
- navigation_help
- general_chat

Reply ONLY with the exact string of the category, nothing else.`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0,
      max_tokens: 20,
    });
    
    const intent = response.choices[0].message.content.trim();
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
        // Simple extraction for budget/location could be improved.
        // For now, we fetch a few tours that might match.
        // In a real app, you might use an LLM to extract budget/location filters first.
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
    if (!openai) throw new Error("OpenAI is not initialized");
    let contextString = "";
    if (contextData) {
      contextString = `\n\nContext Information (Use this to answer factual questions if relevant):\n${JSON.stringify(contextData, null, 2)}`;
    }

    const systemPrompt = `You are Nimal, a friendly and professional Sri Lanka travel agent working for PearlPath. 
Your goal is to help users with their travel plans in Sri Lanka.
Answer factual claims (such as price, availability, policy, and specific tour details) ONLY from the given Context Information.
If the context information does not cover it, do not guess. Instead, politely say "Let me connect you with support for more specific details."
Maintain a warm, welcoming tone. Keep responses concise and helpful.${contextString}`;

    // Include the last 4-6 turns of conversation history
    const historyToInclude = conversationHistory.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyToInclude,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error; // Re-throw to handle in the main flow
  }
}

async function handleChatMessage(message, conversationHistory = [], userId = null) {
  try {
    if (!process.env.OPENAI_API_KEY) {
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
