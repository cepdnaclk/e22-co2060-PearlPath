const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../backend/models/User');

describe('CO2040 Unit Testing - PearlPath User Model (Security Logic)', () => {
  
  describe('Password Hashing & Verification (AAA Pattern)', () => {

    test('should return true when the entered password matches the hashed password', async () => {
      // ----------------------------------------------------
      // ARRANGE: Create a fake user instance and a known password
      // ----------------------------------------------------
      const plainTextPassword = 'MySecretPassword123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
      
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: hashedPassword
      });

      // ----------------------------------------------------
      // ACT: Call the matchPassword utility function
      // ----------------------------------------------------
      const isMatch = await user.matchPassword(plainTextPassword);

      // ----------------------------------------------------
      // ASSERT: Verify the logic returns true
      // ----------------------------------------------------
      expect(isMatch).toBe(true);
    });

    test('should return false when the entered password does NOT match', async () => {
      // ARRANGE
      const plainTextPassword = 'MySecretPassword123';
      const wrongPassword = 'WrongPassword456';
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
      
      const user = new User({
        password: hashedPassword
      });

      // ACT
      const isMatch = await user.matchPassword(wrongPassword);

      // ASSERT
      expect(isMatch).toBe(false);
    });

    test('should handle legacy unhashed passwords correctly for backwards compatibility', async () => {
      // ARRANGE: A password that does not start with bcrypt's "$2" prefix
      const legacyPassword = 'plainTextLegacyPassword';
      const user = new User({
        password: legacyPassword
      });

      // ACT
      const isMatch = await user.matchPassword('plainTextLegacyPassword');
      const isNotMatch = await user.matchPassword('wrongPassword');

      // ASSERT
      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });

  }); // Close the Password Hashing describe block

  describe('User Schema Required Fields & Defaults', () => {

    test('should allow creating a valid user object', () => {
      const user = new User({ firstName: 'A', lastName: 'B', email: 'c@c.com', phone: '123', password: 'pass' });
      const error = user.validateSync();
      expect(error).toBeUndefined();
    });

    test('should throw error if email is missing', () => {
      const user = new User({ firstName: 'A', lastName: 'B', phone: '123', password: 'pass' });
      const error = user.validateSync();
      expect(error.errors.email).toBeDefined();
    });

    test('should default role to "tourist"', () => {
      const user = new User({ firstName: 'A', lastName: 'B', email: 'c@c.com', phone: '123', password: 'pass' });
      expect(user.role).toBe('tourist');
    });

    test('should default status to "pending"', () => {
      const user = new User({ firstName: 'A', lastName: 'B', email: 'c@c.com', phone: '123', password: 'pass' });
      expect(user.status).toBe('pending');
    });

    test('should default isEmailVerified to false', () => {
      const user = new User({ firstName: 'A', lastName: 'B', email: 'c@c.com', phone: '123', password: 'pass' });
      expect(user.isEmailVerified).toBe(false);
    });

    test('should throw error if role is an invalid enum', () => {
      const user = new User({ firstName: 'A', lastName: 'B', email: 'c@c.com', phone: '123', password: 'pass', role: 'superadmin' });
      const error = user.validateSync();
      expect(error.errors.role).toBeDefined();
    });

  });

});
