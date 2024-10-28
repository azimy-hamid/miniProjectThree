import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const User_Roles = sequelize.define(
  "User_Roles",
  {
    role_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    role_name: {
      type: DataTypes.ENUM("student", "teacher", "admin", "super"),
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
    hooks: {
      afterSync: async () => {
        const defaultRoles = [
          { role_name: "student", role_description: "Regular student role" },
          { role_name: "teacher", role_description: "Regular teacher role" },
          {
            role_name: "admin",
            role_description: "Administrator with full access",
          },
          {
            role_name: "super",
            role_description: "Super user with elevated permissions",
          },
        ];

        for (const role of defaultRoles) {
          await User_Roles.findOrCreate({
            where: { role_name: role.role_name },
            defaults: role,
          });
        }
      },
    },
  }
);

export default User_Roles;
