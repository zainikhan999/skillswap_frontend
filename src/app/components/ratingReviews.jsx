import React from "react";

export default function ratingReviews() {
  return (
    <div>
      <h1>Rating and Reviews</h1>
      <p>Here you can find the ratings and reviews for the products.</p>
      <div className="rating-reviews-container">
        <div className="rating-reviews-item">
          <h2>Product 1</h2>
          <p>Rating: 4.5/5</p>
          <p>Review: Great product!</p>
        </div>
        <div className="rating-reviews-item">
          <h2>Product 2</h2>
          <p>Rating: 3.8/5</p>
          <p>Review: Good value for money.</p>
        </div>
      </div>
    </div>
  );
}
