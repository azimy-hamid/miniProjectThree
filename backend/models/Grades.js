import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Grades = sequelize.define(
  "Grades",
  {
    grade_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    grade_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
        isInt: {
          msg: "Grade level must be an integer between 1 and 12.",
        },
      },
    },
    grade_code: {
      type: DataTypes.STRING,
      unique: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "grades",
    timestamps: true,
    hooks: {
      beforeValidate: async (grade) => {
        // Check if a grade_code already exists to avoid reassigning during updates
        if (!grade.grade_code) {
          const latestGrade = await Grades.findOne({
            order: [
              [
                sequelize.literal("CAST(SUBSTRING(grade_code, 5) AS UNSIGNED)"),
                "DESC",
              ],
            ],
          });

          const lastNumber = latestGrade
            ? parseInt(latestGrade.grade_code.split("-")[1], 10)
            : 0;
          grade.grade_code = `GRD-${lastNumber + 1}`;
        }
      },
      afterSync: async () => {
        const defaultGrades = Array.from({ length: 12 }, (_, index) => ({
          grade_level: index + 1,
        }));

        for (const grade of defaultGrades) {
          await Grades.findOrCreate({
            where: { grade_level: grade.grade_level },
            defaults: {
              grade_code: `GRD-${grade.grade_level}`, // Generate a unique grade code
            },
          });
        }
      },
    },
  }
);

export default Grades;
