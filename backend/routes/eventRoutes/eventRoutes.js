import express from "express";
import * as eventControllers from "../../controllers/eventControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const eventRoutes = express.Router();

eventRoutes.post(
  "/create-event",
  authenticate(["admin"]),
  eventControllers.createEvent
);
eventRoutes.get(
  "/get-all-events",
  authenticate(["admin"]),
  eventControllers.getAllEvents
);
eventRoutes.get(
  "/get-specific-event/:eventId",
  authenticate(["admin"]),
  eventControllers.getEventById
);
eventRoutes.put(
  "/update-event-details-by-id/:eventId",
  authenticate(["admin"]),
  eventControllers.updateEvent
);
eventRoutes.delete(
  "/delete-event/:eventId",
  authenticate(["admin"]),
  eventControllers.deleteEvent
);
eventRoutes.put(
  "/recover-event-by-id/:eventId",
  authenticate(["admin"]),
  eventControllers.recoverEvent
);

export default eventRoutes;
