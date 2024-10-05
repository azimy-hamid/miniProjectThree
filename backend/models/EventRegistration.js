import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const EventRegistration = sequelize.define(
  "EventRegistration",
  {
    registration_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    student_id_fk: {
      type: DataTypes.UUID, // UUID for Student foreign key
      allowNull: false,
      references: {
        model: "students", // Reference to Student model
        key: "student_id_pk", // PK in Student model
      },
    },
    event_id_fk: {
      type: DataTypes.UUID, // UUID for Event foreign key
      allowNull: false,
      references: {
        model: "events", // Reference to Event model
        key: "event_id_pk", // PK in Event model
      },
    },
    registration_date: {
      type: DataTypes.DATEONLY, // Date of registration
      allowNull: false,
    },
  },
  {
    tableName: "event_registration", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
EventRegistration.associate = (models) => {
  EventRegistration.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in EventRegistration model
    targetKey: "student_id_pk", // PK in Student model
  });

  EventRegistration.belongsTo(models.Events, {
    foreignKey: "event_id_fk", // FK in EventRegistration model
    targetKey: "event_id_pk", // PK in Events model
  });
};

export default EventRegistration;
