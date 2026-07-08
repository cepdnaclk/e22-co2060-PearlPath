import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Send } from 'lucide-react';

const ReviewSection = ({ targetId, targetModel }) => {
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/api/reviews/${targetId}`);
      const data = await response.json();
      if (response.ok && data.response) {
        setReviews(data.response);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to leave a review.');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      const response = await authFetch('http://127.0.0.1:3001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetModel,
          rating,
          comment
        })
      });

      const data = await response.json();
      if (response.ok) {
        setReviews([data.review, ...reviews]);
        setComment('');
        setRating(5);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-500 py-4">Loading reviews...</div>;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
      
      {/* Review Submission Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Leave a Review</h3>
          
          {error && <div className="mb-4 text-red-500 text-sm font-bold">{error}</div>}
          
          <div className="mb-4 flex items-center gap-2">
            <span className="font-medium text-gray-700">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    size={24} 
                    className={star <= rating ? 'text-sunset-gold fill-sunset-gold' : 'text-gray-300'} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sunset-teal outline-none text-sm resize-none"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-sunset-teal text-white font-bold py-2 px-6 rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : 'Post Review'}
            <Send size={16} />
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
          <p className="text-blue-800 font-medium">Please sign in to leave a review.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">
                  {review.userId?.firstName} {review.userId?.lastName}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? 'text-sunset-gold fill-sunset-gold' : 'text-gray-200'} 
                  />
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
