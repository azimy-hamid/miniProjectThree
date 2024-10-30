import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students.js";

const Fees = sequelize.define(
  "Fees",
  {
    fee_id_pk: {
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
    fee_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "overdue", "partially paid"),
      defaultValue: "pending",
      allowNull: false,
      validate: {
        isIn: {
          args: [["pending", "paid", "overdue", "partially paid"]],
          msg: "Payment status must be one of the following: 'pending', 'paid', 'overdue', or 'partially paid'.",
        },
      },
    },
    payment_date: {
      type: DataTypes.DATE,
    },
    penalty: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0, // Default penalty amount for late payment
    },
    discounts: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0, // Default discount applied to the fee
    },
    payment_mode: {
      type: DataTypes.STRING(50), // Specifies max length for payment mode
    },
    semester: {
      type: DataTypes.ENUM("1", "2"), // Specify valid semester values as ENUM
      allowNull: false,
      validate: {
        isIn: {
          args: [["1", "2"]], // Optional, since ENUM already restricts values
          msg: "Fee Semester must be one of the following values: '1' or '2'.",
        },
      },
    },
    year: {
      type: DataTypes.INTEGER, // Using INTEGER for year
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Soft delete flag
    },
  },
  {
    tableName: "fees", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default Fees;
