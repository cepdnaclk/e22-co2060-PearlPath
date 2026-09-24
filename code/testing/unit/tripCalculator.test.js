/**
 * CO2040 Software Engineering Module - Unit Testing Suite
 * Core Concept: Unit Testing & the AAA (Arrange, Act, Assert) Pattern
 * 
 * Unit testing isolates an individual unit of code (a pure function/component)
 * to verify its behavior independently of external systems, databases, or APIs.
 */

const { calculateTripBudget, calculateTripDuration } = require('../../backend/utils/tripCalculator');

describe('CO2040 Unit Testing - PearlPath Trip Calculator Utility', () => {

  describe('calculateTripBudget()', () => {
    
    test('should correctly calculate total budget without discount using AAA pattern', () => {
      // ----------------------------------------------------
      // ARRANGE: Set up the test inputs and expected outputs
      // ----------------------------------------------------
      const dailyRate = 50;   // $50 per day per guest
      const days = 4;         // 4 days trip
      const guests = 2;       // 2 guests
      const discountCode = '';

      // Expected base cost = 50 * 4 * 2 = 400
      // Subtotal = 400
      // Tax (5%) = 20
      // Expected final total = 420
      const expectedBaseCost = 400;
      const expectedFinalTotal = 420;

      // ----------------------------------------------------
      // ACT: Execute the unit function under test
      // ----------------------------------------------------
      const result = calculateTripBudget(dailyRate, days, guests, discountCode);

      // ----------------------------------------------------
      // ASSERT: Verify that the result matches expectations
      // ----------------------------------------------------
      expect(result).toBeDefined();
      expect(result.baseCost).toBe(expectedBaseCost);
      expect(result.discountPercent).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.taxAmount).toBe(20);
      expect(result.finalTotal).toBe(expectedFinalTotal);
    });

    test('should apply PEARL10 promo code (10% discount) correctly using AAA pattern', () => {
      // ARRANGE
      const dailyRate = 100;
      const days = 5;
      const guests = 1;
      const discountCode = 'PEARL10';

      // Base cost = 100 * 5 * 1 = 500
      // 10% discount = 50
      // Subtotal = 450
      // Tax (5%) = 22.5
      // Expected total = 472.5
      const expectedBaseCost = 500;
      const expectedDiscountAmount = 50;
      const expectedFinalTotal = 472.5;

      // ACT
      const result = calculateTripBudget(dailyRate, days, guests, discountCode);

      // ASSERT
      expect(result.baseCost).toBe(expectedBaseCost);
      expect(result.discountPercent).toBe(10);
      expect(result.discountAmount).toBe(expectedDiscountAmount);
      expect(result.finalTotal).toBe(expectedFinalTotal);
    });

    test('should throw an error when daily rate is non-positive (AAA pattern)', () => {
      // ARRANGE
      const invalidDailyRate = -10;
      const days = 3;
      const guests = 2;

      // ACT & ASSERT
      expect(() => {
        calculateTripBudget(invalidDailyRate, days, guests);
      }).toThrow('Invalid daily rate: Must be a positive number');
    });

    test('should throw an error when number of guests is less than 1 (AAA pattern)', () => {
      // ARRANGE
      const dailyRate = 50;
      const days = 2;
      const invalidGuests = 0;

      // ACT & ASSERT
      expect(() => {
        calculateTripBudget(dailyRate, days, invalidGuests);
      }).toThrow('Invalid guests count: Must be at least 1 guest');
    });

  });

  describe('calculateTripDuration()', () => {

    test('should calculate duration in days between valid start and end dates', () => {
      // ARRANGE
      const startDate = '2026-10-01';
      const endDate = '2026-10-05';
      const expectedDays = 5; // Oct 1, 2, 3, 4, 5 inclusive

      // ACT
      const duration = calculateTripDuration(startDate, endDate);

      // ASSERT
      expect(duration).toBe(expectedDays);
    });

    test('should throw error if end date is before start date', () => {
      // ARRANGE
      const startDate = '2026-10-05';
      const endDate = '2026-10-01';

      // ACT & ASSERT
      expect(() => {
        calculateTripDuration(startDate, endDate);
      }).toThrow('End date cannot be before start date');
    });

  });

});
