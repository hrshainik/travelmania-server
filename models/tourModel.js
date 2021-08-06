const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name!"],
    unique: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration!"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size!"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty level!"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  retingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price!"],
  },
  discount: Number,
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image!"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
