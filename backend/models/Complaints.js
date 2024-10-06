import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Users from "./Users";

const Complaints = sequelize.define("Complaints", {
  complaint_id_pk: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id_fk: {
    type: DataTypes.UUID,
    references: {
      model: Users,
      key: "user_id_pk",
    },
  },
  complaint_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complaint_status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_date: {
    type: DataTypes.DATE,
  },
});

// Associations
Users.hasMany(Complaints, { foreignKey: "user_id_fk", as: "complaints" });
Complaints.belongsTo(Users, { foreignKey: "user_id_fk", as: "user" });

export default Complaints;
