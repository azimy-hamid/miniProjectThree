import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/dbConfig.js";

dotenv.config();

const syncDatabase = async () => {
  try {
    await sequelize.sync(); // You can use { force: true } during development to reset the tables
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
};

const startServer = async () => {
  await syncDatabase();

  app.listen(process.env.PORT_NUMBER, () => {
    console.log(
      `Mini Project Three Backend Server running on port: ${process.env.PORT_NUMBER}`
    );
  });
};

startServer();
