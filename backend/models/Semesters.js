import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Semesters = sequelize.define(
  "Semesters",
  {
    semester_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    semester_number: {
      type: DataTypes.ENUM("1", "2"), // Specify valid semester values as ENUM
      allowNull: false,
      validate: {
        isIn: {
          args: [["1", "2"]], // Optional, since ENUM already restricts values
          msg: "Semester must be one of the following values: '1' or '2'",
        },
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "semesters",
    timestamps: true, // Manages createdAt and updatedAt
  }
);

export default Semesters;
