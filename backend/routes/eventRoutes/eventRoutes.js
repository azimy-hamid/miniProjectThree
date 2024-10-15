import express from "express";
import * as eventControllers from "../../controllers/eventControllers.js";

const eventRoutes = express.Router();

eventRoutes.post("/create-event", eventControllers.createEvent);
eventRoutes.get("/get-all-events", eventControllers.getAllEvents);
eventRoutes.get("/get-specific-event/:eventId", eventControllers.getEventById);
eventRoutes.put(
  "/update-event-details-by-id/:eventId",
  eventControllers.updateEvent
);
eventRoutes.delete("/delete-event/:eventId", eventControllers.deleteEvent);
eventRoutes.put("/recover-event-by-id/:eventId", eventControllers.recoverEvent);

export default eventRoutes;
