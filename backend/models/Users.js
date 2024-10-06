import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import User_Role_Assignment from "./UserRoleAssignment.js";

const Users = sequelize.define(
  "Users",
  {
    user_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id_fk: {
      type: DataTypes.UUID,
      allowNull: false, // Optional: enforce that this field is always present
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Users.belongsToMany(User_Role_Assignment, {
  through: "User_Role_Assignment",
  foreignKey: "user_id_fk",
});

export default Users;
