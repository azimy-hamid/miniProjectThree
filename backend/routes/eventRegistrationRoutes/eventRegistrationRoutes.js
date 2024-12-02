import express from "express";
import * as eventRegistrationControllers from "../../controllers/eventRegistrationControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const eventRegistrationRoutes = express.Router();

eventRegistrationRoutes.post(
  "/create-event-registration",
  authenticate(["admin"]),
  eventRegistrationControllers.createEventRegistration
);
eventRegistrationRoutes.get(
  "/get-all-event-registrations",
  authenticate(["admin"]),
  eventRegistrationControllers.getAllEventRegistrations
);
eventRegistrationRoutes.get(
  "/get-specific-event-registration/:registrationId",
  authenticate(["admin"]),
  eventRegistrationControllers.getEventRegistrationById
);
eventRegistrationRoutes.put(
  "/update-event-registration-details-by-id/:registrationId",
  authenticate(["admin"]),
  eventRegistrationControllers.updateEventRegistration
);
eventRegistrationRoutes.delete(
  "/delete-event-registration/:registrationId",
  authenticate(["admin"]),
  eventRegistrationControllers.deleteEventRegistration
);
eventRegistrationRoutes.put(
  "/recover-event-registration-by-id/:registrationId",
  authenticate(["admin"]),
  eventRegistrationControllers.recoverEventRegistration
);

export default eventRegistrationRoutes;
