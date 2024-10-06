import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students";
import Teachers from "./Teachers";

const Counseling_Appointments = sequelize.define(
  "Counseling_Appointments",
  {
    appointment_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    student_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Students,
        key: "student_id_pk",
      },
    },
    counselor_id_fk: {
      type: DataTypes.UUID,
      references: {
        model: Teachers,
        key: "teacher_id_pk",
      },
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    appointment_status: {
      type: DataTypes.STRING,
      defaultValue: "Scheduled",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "counseling_appointments", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Students.hasMany(Counseling_Appointments, {
  foreignKey: "student_id_fk",
  as: "appointments",
});
Counseling_Appointments.belongsTo(Students, {
  foreignKey: "student_id_fk",
  as: "student",
});

Teachers.hasMany(Counseling_Appointments, {
  foreignKey: "counselor_id_fk",
  as: "counseling_sessions",
});
Counseling_Appointments.belongsTo(Teachers, {
  foreignKey: "counselor_id_fk",
  as: "counselor",
});

export default Counseling_Appointments;
