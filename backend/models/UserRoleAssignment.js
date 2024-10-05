import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const UserRoleAssignment = sequelize.define(
  "UserRoleAssignment",
  {
    user_role_assignment_id: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    user_id_fk: {
      type: DataTypes.UUID, // FK referencing User
      allowNull: false,
      references: {
        model: "users", // Reference to Users model
        key: "user_id_pk", // PK in Users model
      },
    },
    role_id_fk: {
      type: DataTypes.UUID, // FK referencing UserRole
      allowNull: false,
      references: {
        model: "user_roles", // Reference to User Roles model
        key: "role_id_pk", // PK in User Roles model
      },
    },
  },
  {
    tableName: "user_role_assignments", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default UserRoleAssignment;
