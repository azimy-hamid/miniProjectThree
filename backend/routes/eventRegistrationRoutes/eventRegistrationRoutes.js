import express from "express";
import * as eventRegistrationControllers from "../../controllers/eventRegistrationControllers.js";

const eventRegistrationRoutes = express.Router();

eventRegistrationRoutes.post(
  "/create-event-registration",
  eventRegistrationControllers.createEventRegistration
);
eventRegistrationRoutes.get(
  "/get-all-event-registrations",
  eventRegistrationControllers.getAllEventRegistrations
);
eventRegistrationRoutes.get(
  "/get-specific-event-registration/:registrationId",
  eventRegistrationControllers.getEventRegistrationById
);
eventRegistrationRoutes.put(
  "/update-event-registration-details-by-id/:registrationId",
  eventRegistrationControllers.updateEventRegistration
);
eventRegistrationRoutes.delete(
  "/delete-event-registration/:registrationId",
  eventRegistrationControllers.deleteEventRegistration
);
eventRegistrationRoutes.put(
  "/recover-event-registration-by-id/:registrationId",
  eventRegistrationControllers.recoverEventRegistration
);

export default eventRegistrationRoutes;
