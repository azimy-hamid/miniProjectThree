import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const User = sequelize.define(
  "User",
  {
    user_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "users", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default User;
