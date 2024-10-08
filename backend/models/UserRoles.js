import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { text } from "express";

const User_Roles = sequelize.define(
  "User_Roles",
  {
    role_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role_description: {
      type: DataTypes.TEXT,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user_roles", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default User_Roles;
