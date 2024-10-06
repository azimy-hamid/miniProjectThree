import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Students from "./Students";

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
    fee_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fee_status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "fees", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Associations
Students.hasMany(Fees, { foreignKey: "student_id_fk", as: "fees" });
Fees.belongsTo(Students, { foreignKey: "student_id_fk", as: "student" });

export default Fees;
