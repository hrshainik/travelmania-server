const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name!"],
      unique: true,
      trim: true,
      maxlength: [35, "A tour must have less or equal than 35 characters!"],
      minlenght: [3, "A tour must have more or equal than 3 characters!"]
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration!"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size!"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty level!"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above or equal to 1"],
      max: [5, "Rating must be below or equal to 5"]
    },
    retingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price!"]
    },
    discount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only point to current doc on new document creation
          return val < this.price;
        },
        message: "Discount price should be less than regular price!"
      }
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image!"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    draftTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("durationWeeks").get(function() {
  const durationInWeeks = this.duration / 7;
  return durationInWeeks.toFixed(2);
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id"
});

// Document Middleware
// Create slug before run save/create method
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query Middleware
tourSchema.pre("find", function(next) {
  this.find({ draftTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({ draftTour: { $ne: true } });

  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });

  next();
});

// Aggregation Middleware
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { draftTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
