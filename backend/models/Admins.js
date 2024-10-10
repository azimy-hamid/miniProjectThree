import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Admins = sequelize.define(
  "Admins",
  {
    admin_id_pk: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      // Indicating that this is a hashed password
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    admin_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "admins", // Ensures the table name is in snake_case
    timestamps: true, // Automatically adds created_at and updated_at fields
  }
);

export default Admins;
