import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Event = sequelize.define(
  "Event",
  {
    event_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    event_name: {
      type: DataTypes.STRING(100), // Name of the event
      allowNull: false,
    },
    event_description: {
      type: DataTypes.TEXT, // Description of the event
      allowNull: true, // Can be null if no description is provided
    },
    event_date: {
      type: DataTypes.DATEONLY, // Date of the event
      allowNull: false,
    },
  },
  {
    tableName: "event", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Event.associate = (models) => {
  // Association with Event_Registration
  Event.hasMany(models.Event_Registration, {
    foreignKey: "event_id_fk", // FK in Event_Registration model
    sourceKey: "event_id_pk", // PK in Event model
  });

  // If you want to associate with teachers, you can do something like this:
  // Event.belongsToMany(models.Teacher, {
  //   through: 'Event_Teacher', // Junction table if needed
  //   foreignKey: "event_id_fk",
  //   otherKey: "teacher_id_fk",
  // });
};

export default Event;
