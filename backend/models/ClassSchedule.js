import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Classrooms from "./Classrooms.js";
import Subjects from "./Subjects";

const ClassSchedule = sequelize.define(
  "ClassSchedule",
  {
    schedule_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    subject_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Subjects,
        key: "subject_id_pk",
      },
    },
    classroom_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Classrooms,
        key: "classroom_id_pk",
      },
    },
    day_of_week: {
      type: DataTypes.STRING,
    },
    start_time: {
      type: DataTypes.TIME,
    },
    end_time: {
      type: DataTypes.TIME,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "class_schedule", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Subjects.hasMany(ClassSchedule, {
  foreignKey: "subject_id_fk",
  as: "schedules",
});
ClassSchedule.belongsTo(Subjects, {
  foreignKey: "subject_id_fk",
  as: "subject",
});

Classrooms.hasMany(ClassSchedule, {
  foreignKey: "classroom_id_fk",
  as: "schedules",
});
ClassSchedule.belongsTo(Classrooms, {
  foreignKey: "classroom_id_fk",
  as: "classroom",
});

export default ClassSchedule;
