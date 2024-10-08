import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Students = sequelize.define(
  "Students",
  {
    student_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "prefer not to say"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female", "prefer not to say"]],
          msg: "Gender must be one of the following: male, female, or prefer not to say.",
        },
      },
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    section: {
      type: DataTypes.STRING,
    },
    join_date: {
      type: DataTypes.DATE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "students", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Students;
