import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Reviews = ({ reviews, handleReviewSubmit, rating, setRating, hover, setHover }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  return (
    <div className="bg-light p-4 rounded shadow">
      <h2>Student Reviews</h2>
      <hr />
      {displayedReviews.length > 0 ? displayedReviews.map((review, index) => (
        <div key={index} className="mb-3">
          <div className="d-flex justify-content-between">
            <span className="text-warning">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            <span>{review.reviewerName}</span>
          </div>
          <p>{review.comment}</p>
        </div>
      )) : <p>No reviews yet.</p>}
      
      {reviews.length > 5 && (
        <button
          className="btn btn-link p-0"
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? 'Show Less' : 'See All'}
        </button>
      )}

      <h3 className="mt-4">Leave a Review</h3>
      <form onSubmit={handleReviewSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="rating">Rating:</label>
          <div className="star-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                type="button"
                key={i}
                className={`btn btn-link p-0 ${i < (hover || rating) ? 'text-warning' : 'text-muted'}`}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(rating)}
              >
                <FontAwesomeIcon icon={faStar} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea id="comment" name="comment" className="form-control" rows="4"></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default Reviews;
