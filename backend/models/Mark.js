import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Mark = sequelize.define(
  "Mark",
  {
    mark_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    subject_id_fk: {
      type: DataTypes.UUID, // Use UUID for Subject foreign key
      allowNull: false,
      references: {
        model: "subjects", // Reference to Subject model
        key: "subject_id_pk", // Primary key in Subject model
      },
    },
    student_id_fk: {
      type: DataTypes.UUID, // Use UUID for Student foreign key
      allowNull: false,
      references: {
        model: "students", // Reference to Student model
        key: "student_id_pk", // Primary key in Student model
      },
    },
    subject_mark: {
      type: DataTypes.INTEGER, // Use integer for marks
      allowNull: false,
    },
  },
  {
    tableName: "mark", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Mark.associate = (models) => {
  Mark.belongsTo(models.Subject, {
    foreignKey: "subject_id_fk", // FK in Marks model
    targetKey: "subject_id_pk", // PK in Subject model
  });

  Mark.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in Marks model
    targetKey: "student_id_pk", // PK in Student model
  });
};

export default Mark;
