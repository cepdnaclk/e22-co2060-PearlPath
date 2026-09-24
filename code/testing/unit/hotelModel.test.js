const mongoose = require('mongoose');
const Hotel = require('../../backend/models/Hotel');

describe('CO2040 Unit Testing - PearlPath Hotel Model (Data Validation)', () => {

  describe('Hotel Schema Required Fields & Defaults', () => {

    test('should allow creating a valid hotel object', () => {
      const hotel = new Hotel({
        ownerId: new mongoose.Types.ObjectId(),
        name: 'Pearl Beach Resort',
        pricePerNight: 120,
        location: 'Mirissa',
        images: ['img1.jpg']
      });
      const error = hotel.validateSync();
      expect(error).toBeUndefined(); // No errors
    });

    test('should throw error if ownerId is missing', () => {
      const hotel = new Hotel({ name: 'Resort', pricePerNight: 100, location: 'Galle', images: ['img'] });
      const error = hotel.validateSync();
      expect(error.errors.ownerId).toBeDefined();
    });

    test('should throw error if name is missing', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), pricePerNight: 100, location: 'Galle', images: ['img'] });
      const error = hotel.validateSync();
      expect(error.errors.name).toBeDefined();
    });

    test('should throw error if pricePerNight is missing', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), name: 'Resort', location: 'Galle', images: ['img'] });
      const error = hotel.validateSync();
      expect(error.errors.pricePerNight).toBeDefined();
    });

    test('should throw error if location is missing', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), name: 'Resort', pricePerNight: 100, images: ['img'] });
      const error = hotel.validateSync();
      expect(error.errors.location).toBeDefined();
    });

    test('should default rooms to 1 and starRating to 3 if not provided', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), name: 'Resort', pricePerNight: 100, location: 'Galle', images: ['img'] });
      expect(hotel.rooms).toBe(1);
      expect(hotel.starRating).toBe(3);
    });

    test('should default status to "pending"', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), name: 'Resort', pricePerNight: 100, location: 'Galle', images: ['img'] });
      expect(hotel.status).toBe('pending');
    });

    test('should throw error if status is not an allowed enum value', () => {
      const hotel = new Hotel({ ownerId: new mongoose.Types.ObjectId(), name: 'Resort', pricePerNight: 100, location: 'Galle', images: ['img'], status: 'active_now' });
      const error = hotel.validateSync();
      expect(error.errors.status).toBeDefined();
    });

  });

});
