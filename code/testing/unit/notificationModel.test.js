const mongoose = require('mongoose');
const Notification = require('../../backend/models/Notification');

describe('CO2040 Unit Testing - PearlPath Notification Model (Data Validation)', () => {

  describe('Notification Schema Required Fields & Defaults', () => {

    test('should allow creating a valid notification object', () => {
      const notif = new Notification({
        userId: new mongoose.Types.ObjectId(),
        message: 'Your booking is confirmed!'
      });
      const error = notif.validateSync();
      expect(error).toBeUndefined();
    });

    test('should throw error if userId is missing', () => {
      const notif = new Notification({ message: 'Hello' });
      expect(notif.validateSync().errors.userId).toBeDefined();
    });

    test('should throw error if message is missing', () => {
      const notif = new Notification({ userId: new mongoose.Types.ObjectId() });
      expect(notif.validateSync().errors.message).toBeDefined();
    });

    test('should default type and isRead correctly', () => {
      const notif = new Notification({ userId: new mongoose.Types.ObjectId(), message: 'Hello' });
      expect(notif.type).toBe('booking_confirmed');
      expect(notif.isRead).toBe(false);
    });

  });

});
