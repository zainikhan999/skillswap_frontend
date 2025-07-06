import { useEffect, useState } from "react";
import axios from "axios";

export default function RatingAndReviews({ username }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/get-reviews`, {
          params: { username },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (username) {
      fetchReviews();
    }
  }, [username]);

  const handleSubmitReview = async () => {
    if (!newReview || rating < 1 || rating > 5) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/submit-review`,
        {
          username,
          review: newReview,
          rating,
        }
      );

      setReviews((prev) => [...prev, response.data]);
      setNewReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold">User Reviews</h3>

      {reviews.length > 0 ? (
        reviews.map((rev, idx) => (
          <div key={idx} className="my-2 p-3 bg-gray-50 rounded shadow-sm">
            <p className="text-yellow-500">Rating: {"⭐".repeat(rev.rating)}</p>
            <p className="text-gray-700">{rev.review}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">No reviews yet.</p>
      )}

      <div className="mt-4">
        <label className="block mb-1 font-medium">Leave a Review:</label>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Write something..."
        />

        <div className="flex items-center mt-2">
          <span className="mr-2 font-medium">Rating:</span>
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              onClick={() => setRating(r)}
              className={`cursor-pointer text-2xl ${
                r <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={handleSubmitReview}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
