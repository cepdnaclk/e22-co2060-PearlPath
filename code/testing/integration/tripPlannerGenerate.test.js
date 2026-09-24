/**
 * CO2040 Software Engineering Module - API Integration Testing with External Dependency Mocking
 * Concept: Test Doubles, Mocking Third-Party API Services (Google Gemini / aiService)
 * 
 * Demonstrates mocking external AI dependencies (Google Gemini API / aiService) placed in
 * the /code/testing/mocks folder to prevent API rate limits, costs, and network flakiness.
 */

const request = require('supertest');

// Register mocks before requiring backend components using inline require statements
jest.mock('@google/generative-ai', () => require('../mocks/geminiMock'));
jest.mock('../../backend/services/aiService', () => require('../mocks/aiServiceMock'));
jest.mock('../../backend/models/Hotel');
jest.mock('../../backend/models/TourGuide');

const app = require('../../backend/server');
const Hotel = require('../../backend/models/Hotel');
const TourGuide = require('../../backend/models/TourGuide');

describe('CO2040 Integration Testing with Mocking - POST /api/trip-planner/generate', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock database find methods to return sample data cleanly
    Hotel.find.mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { _id: 'h1', name: 'Grand Hotel Kandy', location: 'Kandy', status: 'approved' }
        ])
      })
    });

    TourGuide.find.mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          { _id: 'g1', name: 'Sunil Perera', location: 'Kandy' }
        ])
      })
    });
  });

  test('should generate trip itinerary using mocked Gemini AI service (AAA pattern)', async () => {
    // -------------------------------------------------------------------
    // ARRANGE: Define payload for POST /api/trip-planner/generate
    // -------------------------------------------------------------------
    const tripPayload = {
      destination: 'Kandy',
      startDate: '2026-10-01',
      endDate: '2026-10-05',
      guests: 2,
      budget: '$500',
      interests: ['Culture', 'Nature']
    };

    // -------------------------------------------------------------------
    // ACT: Execute POST request using Supertest
    // -------------------------------------------------------------------
    const response = await request(app)
      .post('/api/trip-planner/generate')
      .send(tripPayload)
      .set('Accept', 'application/json');

    // -------------------------------------------------------------------
    // ASSERT: Verify status 200, valid itinerary structure, and mocked DB suggestions
    // -------------------------------------------------------------------
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('itinerary');
    expect(Array.isArray(response.body.itinerary)).toBe(true);
    expect(response.body.itinerary.length).toBeGreaterThan(0);

    // Verify day 1 structure from our mock
    const day1 = response.body.itinerary[0];
    expect(day1).toHaveProperty('day');
    expect(day1).toHaveProperty('activities');

    // Verify hotel and guide suggestions returned from mocked DB
    expect(response.body).toHaveProperty('suggestedHotels');
    expect(response.body).toHaveProperty('suggestedGuides');
    expect(response.body.suggestedHotels[0].name).toBe('Grand Hotel Kandy');
  });

  test('should return status 400 when required fields (destination, dates) are missing', async () => {
    // ARRANGE: Incomplete request payload
    const invalidPayload = {
      guests: 2,
      budget: '$500'
    };

    // ACT
    const response = await request(app)
      .post('/api/trip-planner/generate')
      .send(invalidPayload);

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Missing required fields');
  });

});
