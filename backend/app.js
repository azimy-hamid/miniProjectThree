import express, { response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes/userRoutes.js";

import authenticate from "./middlewares/reuseableAuthenticator.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", authenticate(["admin"]), async (req, res) => {
  try {
    res.status(200).json({
      response: "This is the root end point for 3rd mini project app",
    });
  } catch (error) {
    res.status(500).json({ rootEndpointError: error });
  }
});

app.use("/user", userRoutes);

export default app;
