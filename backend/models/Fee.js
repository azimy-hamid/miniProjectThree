import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { v4 as uuidv4 } from "uuid"; // Import UUID v4 generator

const Fees = sequelize.define(
  "Fees",
  {
    fee_id_pk: {
      type: DataTypes.UUID, // Use UUID for the primary key
      primaryKey: true,
      defaultValue: uuidv4, // Automatically generate UUID on creation
    },
    student_id_fk: {
      type: DataTypes.UUID, // UUID for student ID
      allowNull: false,
      references: {
        model: "students", // Name of the referenced table
        key: "student_id_pk", // Key in the referenced table
      },
    },
    fee_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["Tuition", "Hostel", "Transportation"]],
      },
    },
    fee_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [["Paid", "Unpaid", "Overdue"]],
      },
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true, // Can be null if payment is not yet made
    },
  },
  {
    tableName: "fees",
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Define association
Fees.associate = (models) => {
  Fees.belongsTo(models.Student, {
    foreignKey: "student_id_fk", // FK in Fees model
    targetKey: "student_id_pk", // PK in Student model
  });
};

export default Fees;
