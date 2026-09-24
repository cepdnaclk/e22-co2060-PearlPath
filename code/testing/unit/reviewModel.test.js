const mongoose = require('mongoose');
const Review = require('../../backend/models/Review');

describe('CO2040 Unit Testing - PearlPath Review Model (Data Validation)', () => {

  describe('Review Schema Required Fields & Defaults', () => {

    test('should allow creating a valid review object', () => {
      const review = new Review({
        userId: new mongoose.Types.ObjectId(),
        targetId: new mongoose.Types.ObjectId(),
        targetModel: 'Hotel',
        rating: 5,
        comment: 'Excellent service!'
      });
      const error = review.validateSync();
      expect(error).toBeUndefined();
    });

    test('should throw error if rating is less than 1 or greater than 5', () => {
      const review1 = new Review({ userId: new mongoose.Types.ObjectId(), targetId: new mongoose.Types.ObjectId(), targetModel: 'Hotel', rating: 0, comment: 'Bad' });
      expect(review1.validateSync().errors.rating).toBeDefined();

      const review2 = new Review({ userId: new mongoose.Types.ObjectId(), targetId: new mongoose.Types.ObjectId(), targetModel: 'Hotel', rating: 6, comment: 'Great' });
      expect(review2.validateSync().errors.rating).toBeDefined();
    });

    test('should throw error if targetModel is invalid', () => {
      const review = new Review({ userId: new mongoose.Types.ObjectId(), targetId: new mongoose.Types.ObjectId(), targetModel: 'AlienSpaceship', rating: 5, comment: 'Cool' });
      expect(review.validateSync().errors.targetModel).toBeDefined();
    });

    test('should throw error if comment is missing', () => {
      const review = new Review({ userId: new mongoose.Types.ObjectId(), targetId: new mongoose.Types.ObjectId(), targetModel: 'Hotel', rating: 5 });
      expect(review.validateSync().errors.comment).toBeDefined();
    });

  });

});
