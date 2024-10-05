import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const UserRole = sequelize.define(
  "UserRole",
  {
    role_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role_description: {
      type: DataTypes.STRING(100),
      allowNull: true, // Can be null if no description is provided
    },
  },
  {
    tableName: "user_roles", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default UserRole;
