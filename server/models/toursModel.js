const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The name of the tour is required'],
      unique: true,
      //validate: [validator.isAlpha, 'Tour name can only contain caracters']
      minlength: [10, 'the tour name must contain more than 10 caracters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Please specify a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Please specify a max group size']
    },
    difficulty: {
      type: String,
      required: [true, 'Please add a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'incorrect difficulty set'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      max: [5.0, "the ratings Average can't be above 5.0"],
      min: [0.0, "the ratings average can't be below 0.0"],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'You must provide a price for the tour']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: "discounted price can't be lower than the original price"
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'please provide a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Please add a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secret: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      adress: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        adress: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Virtual populate
// Virtual populate for reviews
tourSchema.virtual('reviews', {
  ref: 'Review', // The model to use
  foreignField: 'tour', // The field in the Review model that matches the Tour model's _id
  localField: '_id' // The field in the Tour model that matches foreignField
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre(/^find/, function(next) {
//   this.find({ secret: { $ne: true } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
