import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid";

const Teacher = sequelize.define(
  "Teacher",
  {
    teacher_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generates UUID on creation
    },
    teacher_first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    teacher_last_name: {
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
      unique: true, // Ensure email is unique
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    join_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    working_days: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "teachers", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Teacher.associate = (models) => {
  Teacher.hasMany(models.Subject, {
    foreignKey: "teacher_id_fk", // FK in Subject model
    sourceKey: "teacher_id_pk", // PK in Teacher model
  });
};

export default Teacher;
