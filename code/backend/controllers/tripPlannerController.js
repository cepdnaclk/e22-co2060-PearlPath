const Trip = require('../models/Trip');
const Hotel = require('../models/Hotel');
const TourGuide = require('../models/TourGuide');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGenAI = () => {
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  if (process.env.NODE_ENV === 'test') {
    return new GoogleGenerativeAI('test_mock_key');
  }
  return null;
};

const generateTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, guests, budget, interests } = req.body;

    const activeGenAI = getGenAI();

    if (!activeGenAI) {
      return res.status(500).json({ error: 'AI service is not configured.' });
    }

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields: destination, startDate, endDate' });
    }

    const model = activeGenAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    
    const prompt = `You are an expert travel planner. Create a day-by-day itinerary for a trip to ${destination}, Sri Lanka from ${startDate} to ${endDate} for ${guests} guests.
The budget is ${budget}.
The travelers are interested in: ${interests ? interests.join(', ') : 'general sightseeing'}.

Return ONLY a valid JSON array representing the days of the trip. 
Each day should be an object with the following structure:
{
  "day": "Day 1",
  "date": "YYYY-MM-DD",
  "activities": [
    {
      "time": "09:00 AM",
      "name": "Activity Name",
      "description": "Short description of the activity",
      "location": "Location Name (if applicable)",
      "duration": "2 hours"
    }
  ]
}

Ensure the output is ONLY valid JSON, without any markdown formatting or extra text.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Robustly extract the JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not find JSON array in Gemini response");
    }
    
    const itinerary = JSON.parse(jsonMatch[0]);

    // Fetch actual hotels and tour guides from the database to prevent hallucination
    const regex = new RegExp(destination, 'i');
    
    const [suggestedHotels, suggestedGuides] = await Promise.all([
      Hotel.find({ location: regex, status: 'approved' }).limit(4).lean(),
      TourGuide.find({ location: regex }).limit(4).lean()
    ]);

    res.status(200).json({ 
      itinerary,
      suggestedHotels,
      suggestedGuides
    });
  } catch (error) {
    console.error('Error generating trip:', error);
    res.status(500).json({ error: 'Failed to generate trip. Please try again.' });
  }
};

const saveTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, guests, budget, interests, itinerary } = req.body;
    const userId = req.user ? req.user.id : null; // Assuming authMiddleware attaches req.user

    if (!userId) {
      return res.status(401).json({ error: 'User must be logged in to save a trip' });
    }

    const trip = new Trip({
      userId,
      destination,
      startDate,
      endDate,
      guests,
      budget,
      interests,
      itinerary
    });

    await trip.save();
    res.status(201).json({ message: 'Trip saved successfully', trip });
  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({ error: 'Failed to save trip.' });
  }
};

module.exports = {
  generateTrip,
  saveTrip
};
