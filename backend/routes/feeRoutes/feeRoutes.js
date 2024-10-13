import express from "express";
import * as feeControllers from "../../controllers/feeControllers.js";

const feeRoutes = express.Router();

feeRoutes.post("/create-fee", feeControllers.createFee);
feeRoutes.get("/get-all-fees", feeControllers.getAllFees);
feeRoutes.get("/get-specific-fee/:feeId", feeControllers.getFeeById);
feeRoutes.put("/update-fee-details-by-id/:feeId", feeControllers.updateFee);
feeRoutes.delete("/delete-fee/:feeId", feeControllers.deleteFee);
feeRoutes.put("/recover-fee-by-id/:feeId", feeControllers.recoverFee);

export default feeRoutes;
