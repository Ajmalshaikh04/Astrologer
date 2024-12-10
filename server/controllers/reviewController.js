const Review = require("../models/reviewSchema");
const Astrologer = require("../models/astrologerModel");
const { default: mongoose } = require("mongoose");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { astrologerId, rating, comment } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    // Check if the astrologer exists
    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    // Check if the user has already reviewed this astrologer
    const existingReview = await Review.findOne({
      user: userId,
      astrologer: astrologerId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this astrologer" });
    }

    const newReview = new Review({
      user: userId,
      astrologer: astrologerId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

// Get all reviews for an astrologer
exports.getAllReviews = async (req, res) => {
  try {
    const { astrologerId } = req.params;
    const reviews = await Review.find()
      .populate({
        path: "user", // Path to the field to be populated
        select: "firstName lastName email profilePic", // Select specific fields to return
      })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};
// Get all reviews for an astrologer
exports.getAstrologerReviews = async (req, res) => {
  try {
    const { astrologerId } = req.params;
    const reviews = await Review.find({ astrologer: astrologerId })
      .populate({
        path: "user", // Path to the field to be populated
        select: "firstName lastName email profilePic", // Select specific fields to return
      })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

// Get average rating for an astrologer
exports.getAstrologerAverageRating = async (req, res) => {
  try {
    const { astrologerId } = req.params;
    const result = await Review.aggregate([
      { $match: { astrologer: new mongoose.Types.ObjectId(astrologerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      res.status(200).json({
        averageRating: result[0].averageRating,
        totalReviews: result[0].totalReviews,
      });
    } else {
      res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching average rating", error: error.message });
  }
};
