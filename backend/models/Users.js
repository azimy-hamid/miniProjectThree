import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

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
    user_type: {
      type: DataTypes.ENUM("student", "teacher", "admin", "super"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["student", "teacher", "admin", "super"]],
          msg: "User Type must be one of the following values: student, teacher, admin.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

export default Users;
