const mongoose = require('mongoose');
const Vehicle = require('../../backend/models/Vehicle');

describe('CO2040 Unit Testing - PearlPath Vehicle Model (Data Validation)', () => {

  describe('Vehicle Schema Required Fields & Defaults', () => {

    test('should allow creating a valid vehicle object', () => {
      const vehicle = new Vehicle({
        ownerId: new mongoose.Types.ObjectId(),
        makeAndModel: 'Toyota Prius',
        vehicleType: 'Car',
        pricePerDay: 40,
        transmission: 'Auto'
      });
      const error = vehicle.validateSync();
      expect(error).toBeUndefined(); // No errors
    });

    test('should throw error if ownerId is missing', () => {
      const vehicle = new Vehicle({ makeAndModel: 'Toyota', vehicleType: 'Car', pricePerDay: 40, transmission: 'Auto' });
      const error = vehicle.validateSync();
      expect(error.errors.ownerId).toBeDefined();
    });

    test('should throw error if makeAndModel is missing', () => {
      const vehicle = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), vehicleType: 'Car', pricePerDay: 40, transmission: 'Auto' });
      const error = vehicle.validateSync();
      expect(error.errors.makeAndModel).toBeDefined();
    });

    test('should throw error if vehicleType is missing or invalid enum', () => {
      const vehicle1 = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), makeAndModel: 'Toyota', pricePerDay: 40, transmission: 'Auto' });
      expect(vehicle1.validateSync().errors.vehicleType).toBeDefined();

      const vehicle2 = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), makeAndModel: 'Toyota', vehicleType: 'Helicopter', pricePerDay: 40, transmission: 'Auto' });
      expect(vehicle2.validateSync().errors.vehicleType).toBeDefined();
    });

    test('should throw error if pricePerDay is missing', () => {
      const vehicle = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), makeAndModel: 'Toyota', vehicleType: 'Car', transmission: 'Auto' });
      const error = vehicle.validateSync();
      expect(error.errors.pricePerDay).toBeDefined();
    });

    test('should default seats to 4, hasAC to true, and isAvailable to true', () => {
      const vehicle = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), makeAndModel: 'Toyota', vehicleType: 'Car', pricePerDay: 40, transmission: 'Auto' });
      expect(vehicle.seats).toBe(4);
      expect(vehicle.hasAC).toBe(true);
      expect(vehicle.isAvailable).toBe(true);
    });

    test('should default status to "pending"', () => {
      const vehicle = new Vehicle({ ownerId: new mongoose.Types.ObjectId(), makeAndModel: 'Toyota', vehicleType: 'Car', pricePerDay: 40, transmission: 'Auto' });
      expect(vehicle.status).toBe('pending');
    });

  });

});
