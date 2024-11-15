// seed.js or a similar setup file
import bcrypt from "bcryptjs";
import Users from "../models/Users.js";
import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const seedAdmin = async () => {
  try {
    // Step 1: Create super role if it doesn't exist
    const [adminRole, createdRole] = await User_Roles.findOrCreate({
      where: { role_name: "admin" },
      defaults: {
        role_description: "Admin user with all access",
      },
    });

    if (createdRole) {
      console.log("Admin role created:", adminRole.role_name);
    } else {
      console.log("Admin role already exists:", adminRole.role_name);
    }

    // Step 2: Create super user if it doesn't exist
    const adminUserEmail = process.env.ADMIN_USER_EMAIL; // Use env variable
    const [adminUser, createdUser] = await Users.findOrCreate({
      where: { email: adminUserEmail },
      defaults: {
        user_id_fk: uuidv4(), // or set as needed
        user_type: "admin",
        username: process.env.ADMIN_USER_USERNAME, // Use env variable
        password_hash: await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, 10), // Hash the password from env variable
        is_deleted: false,
      },
    });

    if (createdUser) {
      console.log("Admin user created:", adminUser.username);
      await adminUser.update({ user_id_fk: adminUser.user_id_pk });
      console.log(
        "Admin user foreign key updated to user_id_pk:",
        adminUser.user_id_fk
      );
    } else {
      console.log("Admin user already exists:", adminUser.username);
    }

    // Step 3: Assign the role to the super user
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
    console.error("Error creating super user:", error);
  }
};

export default seedAdmin;
