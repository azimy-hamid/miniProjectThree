import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Subject = sequelize.define(
  "Subject",
  {
    subject_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    class_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subject_id_fk: {
      type: DataTypes.UUID, // UUID for Subject foreign key
      allowNull: false,
      references: {
        model: "subjects", // Reference to itself or other model if applicable
        key: "subject_id_pk", // PK in the referenced model
      },
    },
    teacher_id_fk: {
      type: DataTypes.UUID, // UUID for Teacher foreign key
      allowNull: false,
      references: {
        model: "teachers", // Reference to Teacher model
        key: "teacher_id_pk", // PK in Teacher model
      },
    },
    classroom_id_fk: {
      type: DataTypes.UUID, // UUID for Classroom foreign key
      allowNull: false,
      references: {
        model: "classrooms", // Reference to Classroom model
        key: "classroom_id_pk", // PK in Classroom model
      },
    },
    section: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
  },
  {
    tableName: "subjects", // Name of the table in the database
    timestamps: true, // Use Sequelize's default timestamps (createdAt, updatedAt)
  }
);

// Associations
Subject.associate = (models) => {
  Subject.belongsTo(models.Teacher, {
    foreignKey: "teacher_id_fk", // FK in Subject model
    targetKey: "teacher_id_pk", // PK in Teacher model
  });

  Subject.belongsTo(models.Classroom, {
    foreignKey: "classroom_id_fk", // FK in Subject model
    targetKey: "classroom_id_pk", // PK in Classroom model
  });
};

export default Subject;
