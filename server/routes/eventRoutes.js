const express = require('express');
const eventController = require('./../controllers/eventController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    eventController.createEvent
  );

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    eventController.updateEvent
  )
  .delete(
    eventController.deleteEvent
  );

router.route('/type/:type').get(eventController.getEventsByType);

router.route('/latest/:type').get(eventController.getLatestEventsByType);

module.exports = router;
