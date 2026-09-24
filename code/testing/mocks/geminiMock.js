/**
 * CO2040 Concept: Third-Party SDK Mocking
 * Mock implementation for @google/generative-ai GoogleGenerativeAI class.
 * 
 * Prevents real HTTP network requests to Google Gemini servers during test suites.
 */

const mockGeneratedItineraryJSON = JSON.stringify([
  {
    day: "Day 1",
    date: "2026-10-01",
    activities: [
      {
        time: "09:00 AM",
        name: "Visit Temple of the Tooth",
        description: "Explore historic temple in Kandy",
        location: "Kandy",
        duration: "2 hours"
      }
    ]
  }
]);

class MockGenerativeModel {
  async generateContent(prompt) {
    return {
      response: {
        text: () => mockGeneratedItineraryJSON
      }
    };
  }

  startChat() {
    return {
      sendMessage: async () => ({
        response: {
          text: () => "Mocked Gemini chat response"
        }
      })
    };
  }
}

class MockGoogleGenerativeAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getGenerativeModel({ model }) {
    return new MockGenerativeModel();
  }
}

module.exports = {
  GoogleGenerativeAI: MockGoogleGenerativeAI,
  MockGoogleGenerativeAI,
  MockGenerativeModel,
  mockGeneratedItineraryJSON
};
