import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User_Roles = sequelize.define("User_Roles", {
  role_id_pk: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_description: {
    type: DataTypes.TEXT,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
  },
});

export default User_Roles;
