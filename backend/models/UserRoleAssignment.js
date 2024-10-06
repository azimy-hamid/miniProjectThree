import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Users from "./Users.js";
import User_Roles from "./UserRoles.js";

const User_Role_Assignment = sequelize.define(
  "User_Role_Assignment",
  {
    user_role_assignment_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
    },
    user_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "user_id_pk",
      },
    },
    role_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: User_Roles,
        key: "role_id_pk",
      },
    },
  },
  {
    tableName: "user_role_assignment", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Users.belongsToMany(User_Roles, {
  through: User_Role_Assignment,
  foreignKey: "user_id_fk",
});

User_Roles.belongsToMany(Users, {
  through: User_Role_Assignment,
  foreignKey: "role_id_fk",
});

export default User_Role_Assignment;
