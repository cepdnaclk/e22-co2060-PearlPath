const mongoose = require('mongoose');
const Booking = require('../../backend/models/Booking');

describe('CO2040 Unit Testing - PearlPath Booking Model (Data Validation)', () => {

  describe('Booking Schema Required Fields & Defaults', () => {

    test('should allow creating a valid booking object', () => {
      const booking = new Booking({
        userId: new mongoose.Types.ObjectId(),
        providerId: new mongoose.Types.ObjectId(),
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-05'),
        totalPrice: 500
      });
      const error = booking.validateSync();
      expect(error).toBeUndefined(); // No errors
    });

    test('should throw error if userId is missing', () => {
      const booking = new Booking({ providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100 });
      const error = booking.validateSync();
      expect(error.errors.userId).toBeDefined();
    });

    test('should throw error if providerId is missing', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100 });
      const error = booking.validateSync();
      expect(error.errors.providerId).toBeDefined();
    });

    test('should throw error if startDate is missing', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), endDate: new Date(), totalPrice: 100 });
      const error = booking.validateSync();
      expect(error.errors.startDate).toBeDefined();
    });

    test('should throw error if endDate is missing', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), totalPrice: 100 });
      const error = booking.validateSync();
      expect(error.errors.endDate).toBeDefined();
    });

    test('should throw error if totalPrice is missing', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date() });
      const error = booking.validateSync();
      expect(error.errors.totalPrice).toBeDefined();
    });

    test('should default rooms to 1 if not provided', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100 });
      expect(booking.rooms).toBe(1);
    });

    test('should default guests to 1 if not provided', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100 });
      expect(booking.guests).toBe(1);
    });

    test('should default bookingStatus to "pending"', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100 });
      expect(booking.bookingStatus).toBe('pending');
    });

    test('should throw error if bookingStatus is not an allowed enum value', () => {
      const booking = new Booking({ userId: new mongoose.Types.ObjectId(), providerId: new mongoose.Types.ObjectId(), startDate: new Date(), endDate: new Date(), totalPrice: 100, bookingStatus: 'fake_status' });
      const error = booking.validateSync();
      expect(error.errors.bookingStatus).toBeDefined();
    });

  });

});
