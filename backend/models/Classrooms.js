import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Classrooms = sequelize.define("Classrooms", {
  classroom_id_pk: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  capacity: {
    type: DataTypes.INTEGER,
  },
  room_type: {
    type: DataTypes.STRING,
  },
  description: {
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

export default Classrooms;
