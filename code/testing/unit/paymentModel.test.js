const mongoose = require('mongoose');
const Payment = require('../../backend/models/Payment');

describe('CO2040 Unit Testing - PearlPath Payment Model (Data Validation)', () => {

  describe('Payment Schema Required Fields & Defaults', () => {

    test('should allow creating a valid payment object', () => {
      const payment = new Payment({
        userId: new mongoose.Types.ObjectId(),
        bookingId: new mongoose.Types.ObjectId(),
        bookingType: 'hotel',
        amount: 25000,
        paymentMethod: 'bank_transfer'
      });
      const error = payment.validateSync();
      expect(error).toBeUndefined(); // No errors
    });

    test('should throw error if userId is missing', () => {
      const payment = new Payment({ bookingId: new mongoose.Types.ObjectId(), bookingType: 'hotel', amount: 25000, paymentMethod: 'bank_transfer' });
      const error = payment.validateSync();
      expect(error.errors.userId).toBeDefined();
    });

    test('should throw error if bookingId is missing', () => {
      const payment = new Payment({ userId: new mongoose.Types.ObjectId(), bookingType: 'hotel', amount: 25000, paymentMethod: 'bank_transfer' });
      const error = payment.validateSync();
      expect(error.errors.bookingId).toBeDefined();
    });

    test('should throw error if bookingType is invalid enum', () => {
      const payment = new Payment({ userId: new mongoose.Types.ObjectId(), bookingId: new mongoose.Types.ObjectId(), bookingType: 'spaceship', amount: 25000, paymentMethod: 'bank_transfer' });
      const error = payment.validateSync();
      expect(error.errors.bookingType).toBeDefined();
    });

    test('should throw error if amount is missing', () => {
      const payment = new Payment({ userId: new mongoose.Types.ObjectId(), bookingId: new mongoose.Types.ObjectId(), bookingType: 'hotel', paymentMethod: 'bank_transfer' });
      const error = payment.validateSync();
      expect(error.errors.amount).toBeDefined();
    });

    test('should throw error if paymentMethod is missing or invalid enum', () => {
      const payment = new Payment({ userId: new mongoose.Types.ObjectId(), bookingId: new mongoose.Types.ObjectId(), bookingType: 'hotel', amount: 25000, paymentMethod: 'cash' });
      const error = payment.validateSync();
      expect(error.errors.paymentMethod).toBeDefined();
    });

    test('should default currency to "LKR" and paymentStatus to "pending"', () => {
      const payment = new Payment({ userId: new mongoose.Types.ObjectId(), bookingId: new mongoose.Types.ObjectId(), bookingType: 'hotel', amount: 25000, paymentMethod: 'bank_transfer' });
      expect(payment.currency).toBe('LKR');
      expect(payment.paymentStatus).toBe('pending');
    });

  });

});
