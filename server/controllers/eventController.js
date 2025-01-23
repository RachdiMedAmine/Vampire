const Event = require('./../models/eventsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/app-Errors');

exports.getAllEvents = factory.getAll(Event);
exports.getEvent = factory.getOne(Event);
exports.createEvent = factory.createOne(Event);
exports.updateEvent = factory.updateOne(Event);
exports.deleteEvent = factory.deleteOne(Event);

exports.getLatestEventsByType = catchAsync(async (req, res, next) => {
    const { type } = req.params;
    const { limit } = req.query;
    
    if (!['gaming', 'anime'].includes(type)) {
      return next(new AppError('Invalid type. Type must be either "gaming" or "anime".', 400));
    }
  
    const eventsLimit = parseInt(limit, 10) || 3;
  
    const events = await Event.find({ type })
      .sort({ postedAtr: -1 }) 
      .limit(eventsLimit); 
  
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  });

exports.getEventsByType = catchAsync(async (req, res, next) => {
    const { type } = req.params;
  
    // Validate the type
    if (!['gaming', 'anime'].includes(type)) {
      return next(new AppError('Invalid type. Type must be either "gaming" or "anime".', 400));
    }
  
    // Fetch events by type
    const events = await Event.find({ type });
  
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  });
  
  