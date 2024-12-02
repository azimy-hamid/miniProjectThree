import bcrypt from "bcryptjs";
import Users from "../models/Users.js";
import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";
import Admins from "../models/Admins.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const seedAdmin = async () => {
  try {
    // Step 1: Create super role if it doesn't exist
    const [adminRole] = await User_Roles.findOrCreate({
      where: { role_name: "admin" },
      defaults: { role_description: "Admin user with all access" },
    });

    console.log("Admin role created:", adminRole.role_name);

    // Step 2: Create admin in Admins table
    const [admin] = await Admins.findOrCreate({
      where: { email_address: process.env.ADMIN_USER_EMAIL },
      defaults: {
        username: process.env.ADMIN_USER_USERNAME,
        password_hash: process.env.ADMIN_USER_PASSWORD,
        email_address: process.env.ADMIN_USER_EMAIL,
        admin_first_name: process.env.ADMIN_USER_FIRST_NAME,
        admin_last_name: process.env.ADMIN_USER_LAST_NAME,
      },
    });

    console.log("Admin created:", admin.username);

    // Step 3: Create super user in Users table with the correct admin_id_fk
    const [adminUser] = await Users.findOrCreate({
      where: { email: process.env.ADMIN_USER_EMAIL },
      defaults: {
        user_id_fk: admin.admin_id_pk, // Directly use the admin's ID
        user_type: "admin",
        username: process.env.ADMIN_USER_USERNAME,
        password_hash: await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, 10),
        is_deleted: false,
      },
    });

    console.log("Admin user created:", adminUser.username);

    // Step 4: Assign the role to the super user
    const existingAssignment = await User_Role_Assignment.findOne({
      where: {
        user_id_fk: adminUser.user_id_pk,
        role_id_fk: adminRole.role_id_pk,
      },
    });

    if (!existingAssignment) {
      await User_Role_Assignment.create({
        user_id_fk: adminUser.user_id_pk,
        role_id_fk: adminRole.role_id_pk,
      });
      console.log("Role assigned to the admin user.");
    } else {
      console.log("Admin user already has the role assigned.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

export default seedAdmin;
