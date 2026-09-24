/**
 * CO2040 Concept: Test Double / Mocking Configuration
 * Mock object for external AI Service (aiService.js / Google Gemini API).
 * 
 * Using a mock avoids hitting live rate limits, eliminates external network dependencies,
 * and ensures fast, deterministic testing.
 */

const mockGeneratedItinerary = [
  {
    day: "Day 1",
    date: "2026-10-01",
    activities: [
      {
        time: "09:00 AM",
        name: "Visit Temple of the Sacred Tooth Relic",
        description: "Explore the famous cultural landmark in Kandy",
        location: "Kandy",
        duration: "2 hours"
      },
      {
        time: "02:00 PM",
        name: "Royal Botanical Gardens Tour",
        description: "Stroll through the lush flora in Peradeniya",
        location: "Peradeniya",
        duration: "3 hours"
      }
    ]
  },
  {
    day: "Day 2",
    date: "2026-10-02",
    activities: [
      {
        time: "10:00 AM",
        name: "Kandy Lake Walk & Shopping",
        description: "Enjoy peaceful views and local craft markets",
        location: "Kandy City",
        duration: "2.5 hours"
      }
    ]
  }
];

const mockAiService = {
  getIntent: jest.fn().mockResolvedValue("tour_recommendation"),
  retrieveContext: jest.fn().mockResolvedValue({ type: 'tours', data: [] }),
  generateResponse: jest.fn().mockResolvedValue("Mocked Gemini AI response for PearlPath trip planning."),
  handleChatMessage: jest.fn().mockResolvedValue("Hello! I am Traver, your AI assistant."),
  generateTripItinerary: jest.fn().mockResolvedValue(mockGeneratedItinerary),
  mockGeneratedItinerary
};

module.exports = mockAiService;
