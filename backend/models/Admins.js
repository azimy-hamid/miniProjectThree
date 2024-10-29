import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Admins = sequelize.define(
  "Admins",
  {
    admin_id_pk: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
      allowNull: false,
      primaryKey: true,
    },
    admin_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    admin_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin"),
      allowNull: false,
      defaultValue: "admin",
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "admins",
    timestamps: true,
    hooks: {
      beforeValidate: async (admin) => {
        // Find the latest admin_code in the database
        const latestAdmin = await Admins.findOne({
          order: [
            [
              sequelize.literal("CAST(SUBSTRING(admin_code, 5) AS UNSIGNED)"),
              "DESC",
            ],
          ],
        });

        // Extract the numeric part and increment it
        const lastNumber = latestAdmin
          ? parseInt(latestAdmin.admin_code.split("-")[1], 10)
          : 0;
        admin.admin_code = `ADM-${lastNumber + 1}`;
      },
    },
  }
);

export default Admins;
