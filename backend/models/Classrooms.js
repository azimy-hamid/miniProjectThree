import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Classrooms = sequelize.define(
  "Classrooms",
  {
    classroom_id_pk: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    classroom_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
    },
    room_type: {
      type: DataTypes.ENUM(
        "lecture hall",
        "laboratory",
        "computer lab",
        "library",
        "art room",
        "music room",
        "study hall"
      ),
    },
    description: {
      type: DataTypes.TEXT,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "classrooms", // Name of the table in the database
    timestamps: true, // Automatically manage createdAt and updatedAt
    hooks: {
      beforeValidate: async (classroom) => {
        // Find the latest classroom_code in the database
        const latestClassroom = await Classrooms.findOne({
          order: [
            [
              sequelize.literal(
                "CAST(SUBSTRING(classroom_code, 5) AS UNSIGNED)"
              ),
              "DESC",
            ],
          ],
        });

        // Extract the numeric part and increment it
        const lastNumber = latestClassroom
          ? parseInt(latestClassroom.classroom_code.split("-")[1], 10)
          : 0;
        classroom.classroom_code = `CLS-${lastNumber + 1}`;
      },
    },
  }
);

export default Classrooms;
