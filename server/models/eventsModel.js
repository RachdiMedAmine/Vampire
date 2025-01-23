const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(

  {
    title: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please add a description']
    },
    type : {
        required: [true, 'Please add a type'],
        type: String,
        enum: {
          values: ['gaming', 'anime'],
          message: 'an article can be either a game or an anime'
        }
    },
    imageCover: {
      type: String,
      required: [true, 'Please add a cover image']
    },
    images: [String],
    postedAtr: {
      type: Date,
      default: Date.now()
    }
  }
);


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;