import express from "express";
import * as feeControllers from "../../controllers/feeControllers.js";
import authenticate from "../../middlewares/authenticate.js";

const feeRoutes = express.Router();

feeRoutes.post(
  "/create-fee",
  authenticate(["admin"]),
  feeControllers.createFee
);
feeRoutes.get(
  "/get-all-fees",
  authenticate(["admin"]),
  feeControllers.getAllFees
);
feeRoutes.get(
  "/get-specific-fee/:feeId",
  authenticate(["admin"]),
  feeControllers.getFeeById
);
feeRoutes.put(
  "/update-fee-details-by-id/:feeId",
  authenticate(["admin"]),
  feeControllers.updateFee
);
feeRoutes.delete(
  "/delete-fee/:feeId",
  authenticate(["admin"]),
  feeControllers.deleteFee
);
feeRoutes.put(
  "/recover-fee-by-id/:feeId",
  authenticate(["admin"]),
  feeControllers.recoverFee
);

export default feeRoutes;
