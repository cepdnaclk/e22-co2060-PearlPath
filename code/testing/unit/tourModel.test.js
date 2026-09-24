const mongoose = require('mongoose');
const Tour = require('../../backend/models/Tour');

describe('CO2040 Unit Testing - PearlPath Tour Model (Data Validation)', () => {

  describe('Tour Schema Required Fields & Defaults', () => {

    test('should allow creating a valid tour object', () => {
      const tour = new Tour({
        ownerId: new mongoose.Types.ObjectId(),
        title: 'Sigiriya Adventure',
        description: 'A trip to the rock fortress',
        price: 50,
        duration: '1 Day',
        location: 'Sigiriya'
      });
      const error = tour.validateSync();
      expect(error).toBeUndefined();
    });

    test('should throw error if title is missing', () => {
      const tour = new Tour({ ownerId: new mongoose.Types.ObjectId(), description: 'Desc', price: 50, duration: '1 Day', location: 'Sigiriya' });
      expect(tour.validateSync().errors.title).toBeDefined();
    });

    test('should throw error if price is missing', () => {
      const tour = new Tour({ ownerId: new mongoose.Types.ObjectId(), title: 'Tour', description: 'Desc', duration: '1 Day', location: 'Sigiriya' });
      expect(tour.validateSync().errors.price).toBeDefined();
    });

    test('should default isAvailable to true and status to pending', () => {
      const tour = new Tour({ ownerId: new mongoose.Types.ObjectId(), title: 'Tour', description: 'Desc', price: 50, duration: '1 Day', location: 'Sigiriya' });
      expect(tour.isAvailable).toBe(true);
      expect(tour.status).toBe('pending');
    });

  });

});
