import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid"; // Import UUID v4 generator

const Student = sequelize.define(
  "Student",
  {
    student_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generate UUID on creation
    },
    student_first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    student_last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(75),
      allowNull: false,
      unique: true, // Typically email should be unique
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    section: {
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
    join_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Define association
Student.associate = (models) => {
  Student.hasMany(models.Fees, {
    foreignKey: "student_id_fk", // This is the FK in the Fees model
    sourceKey: "student_id_pk", // This is the PK in the Student model
  });

  Student.belongsToMany(models.Classroom, {
    through: models.Classroom_Student, // Junction table
    foreignKey: "student_id_fk",
    otherKey: "class_id_fk",
  });
};

export default Student;
