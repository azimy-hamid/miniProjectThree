// seed.js or a similar setup file
import bcrypt from "bcryptjs";
import Users from "../models/Users.js";
import User_Roles from "../models/UserRoles.js";
import User_Role_Assignment from "../models/UserRoleAssignment.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const seedSuper = async () => {
  try {
    // Step 1: Create super role if it doesn't exist
    const [superRole, createdRole] = await User_Roles.findOrCreate({
      where: { role_name: "super" },
      defaults: {
        role_description: "Super user with all access",
      },
    });

    if (createdRole) {
      console.log("Super role created:", superRole.role_name);
    } else {
      console.log("Super role already exists:", superRole.role_name);
    }

    // Step 2: Create super user if it doesn't exist
    const superUserEmail = process.env.SUPER_USER_EMAIL; // Use env variable
    const [superUser, createdUser] = await Users.findOrCreate({
      where: { email: superUserEmail },
      defaults: {
        user_id_fk: uuidv4(), // or set as needed
        user_type: "super",
        username: process.env.SUPER_USER_USERNAME, // Use env variable
        password_hash: await bcrypt.hash(process.env.SUPER_USER_PASSWORD, 10), // Hash the password from env variable
        is_deleted: false,
      },
    });

    if (createdUser) {
      console.log("Super user created:", superUser.username);
      await superUser.update({ user_id_fk: superUser.user_id_pk });
      console.log(
        "Super user foreign key updated to user_id_pk:",
        superUser.user_id_fk
      );
    } else {
      console.log("Super user already exists:", superUser.username);
    }

    // Step 3: Assign the role to the super user
    const existingAssignment = await User_Role_Assignment.findOne({
      where: {
        user_id_fk: superUser.user_id_pk,
        role_id_fk: superRole.role_id_pk,
      },
    });

    if (!existingAssignment) {
      await User_Role_Assignment.create({
        user_id_fk: superUser.user_id_pk,
        role_id_fk: superRole.role_id_pk,
      });
      console.log("Role assigned to the super user.");
    } else {
      console.log("Super user already has the role assigned.");
    }
  } catch (error) {
    console.error("Error creating super user:", error);
  }
};

export default seedSuper;
