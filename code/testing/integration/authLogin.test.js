/**
 * CO2040 Software Engineering Module - API Integration Testing
 * Concept: Integration Testing & HTTP Endpoint Verification with Supertest
 * 
 * Integration testing checks how multiple components (Express routers, controllers,
 * authentication middleware, and JWT generators) work together in response to HTTP requests.
 */

const request = require('supertest');
const app = require('../../backend/server');
const User = require('../../backend/models/User');

// Mock Mongoose User model to avoid needing a live MongoDB server during tests
jest.mock('../../backend/models/User');

describe('CO2040 Integration Testing - POST /api/login Route', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate user and return status 200 with JWT token for valid credentials', async () => {
    // -------------------------------------------------------------------
    // ARRANGE: Setup test double (Mock Mongoose User document & findOne)
    // -------------------------------------------------------------------
    const mockUserInstance = {
      _id: '507f1f77bcf86cd799439011',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'tourist',
      status: 'approved',
      isEmailVerified: true,
      matchPassword: jest.fn().mockResolvedValue(true) // Mock password match succeeds
    };

    User.findOne.mockResolvedValue(mockUserInstance);

    const loginPayload = {
      email: 'john.doe@example.com',
      password: 'correctpassword123'
    };

    // -------------------------------------------------------------------
    // ACT: Send HTTP POST request to /api/login using Supertest
    // -------------------------------------------------------------------
    const response = await request(app)
      .post('/api/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

    // -------------------------------------------------------------------
    // ASSERT: Verify HTTP response status, JWT token presence, and structure
    // -------------------------------------------------------------------
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toMatchObject({
      _id: '507f1f77bcf86cd799439011',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'tourist'
    });

    // Verify User.findOne was queried with correct email
    expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
    expect(mockUserInstance.matchPassword).toHaveBeenCalledWith('correctpassword123');
  });

  test('should return status 401 when password is invalid', async () => {
    // ARRANGE
    const mockUserInstance = {
      email: 'john.doe@example.com',
      matchPassword: jest.fn().mockResolvedValue(false) // Mock password match fails
    };

    User.findOne.mockResolvedValue(mockUserInstance);

    const loginPayload = {
      email: 'john.doe@example.com',
      password: 'wrongpassword'
    };

    // ACT
    const response = await request(app)
      .post('/api/login')
      .send(loginPayload);

    // ASSERT
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
    expect(response.body).not.toHaveProperty('token');
  });

  test('should return status 401 when user email does not exist', async () => {
    // ARRANGE: User not found in database
    User.findOne.mockResolvedValue(null);

    // ACT
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'nonexistent@example.com', password: 'anyPassword' });

    // ASSERT
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

});
