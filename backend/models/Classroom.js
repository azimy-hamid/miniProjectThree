import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Classroom = sequelize.define(
  "Classroom",
  {
    classroom_id_pk: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Generates a UUID automatically
      primaryKey: true,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    room_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "classrooms",
    timestamps: true, // uses Sequelize's default `createdAt` and `updatedAt`
  }
);

export default Classroom;
