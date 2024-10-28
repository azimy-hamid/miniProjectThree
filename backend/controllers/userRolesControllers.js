import User_Roles from "../models/UserRoles.js";

// CREATE a new user role
const createRole = async (req, res) => {
  const { role_name, role_description } = req.body;

  // Validate input
  if (!role_name) {
    return res
      .status(400)
      .json({ createRoleMessage: "Role name is required." });
  }

  try {
    // Check if the role already exists
    const existingRole = await User_Roles.findOne({ where: { role_name } });
    if (existingRole) {
      return res
        .status(400)
        .json({ createRoleMessage: "Role already exists." });
    }

    // Create a new role
    const newRole = await User_Roles.create({
      role_name: role_name.toLowerCase(),
      role_description,
    });

    return res
      .status(200)
      .json({ createRoleMessage: "Role created successfully.", newRole });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      createRoleMessage: "Server error. Please try again later.",
      createRoleCatchBlkErr: error,
    });
  }
};

// READ all user roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await User_Roles.findAll({
      where: { is_deleted: false },
    });

    if (roles.length === 0) {
      return res.status(404).json({ getAllRolesMessage: "No roles found." });
    }

    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      getAllRolesMessage: "Server error. Please try again later.",
      getAllRolesCatchBlkErr: error,
    });
  }
};

// READ a single user role by ID
const getRoleById = async (req, res) => {
  const { roleId } = req.params;

  try {
    const role = await User_Roles.findByPk(roleId);

    if (!role || role.is_deleted) {
      return res.status(404).json({ getRoleByIdMessage: "Role not found." });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      getRoleByIdMessage: "Server error. Please try again later.",
      getRoleByIdCatchBlkErr: error,
    });
  }
};

// READ a single user role by Name
const getRoleByName = async (req, res) => {
  const { name } = req.params;

  try {
    const role = await User_Roles.findOne({
      where: {
        role_name: name,
      },
    });

    if (!role || role.is_deleted) {
      return res.status(404).json({ getRoleByNameMessage: "Role not found." });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      getRoleByNameMessage: "Server error. Please try again later.",
      getRoleByNameCatchBlkErr: error,
    });
  }
};

// UPDATE a user role by ID
const updateRole = async (req, res) => {
  const { roleId } = req.params;
  const { role_name, role_description } = req.body;

  try {
    const role = await User_Roles.findByPk(roleId);

    if (!role || role.is_deleted) {
      return res.status(404).json({ updateRoleMessage: "Role not found." });
    }

    // Update the role details
    role.role_name = role_name || role.role_name;
    role.role_description = role_description || role.role_description;

    await role.save();

    return res
      .status(200)
      .json({ updateRoleMessage: "Role updated successfully.", role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      updateRoleMessage: "Server error. Please try again later.",
      updateRoleCatchBlkErr: error,
    });
  }
};

// DELETE a user role by ID (soft delete)
const deleteRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const role = await User_Roles.findByPk(roleId);

    if (!role || role.is_deleted) {
      return res.status(404).json({ deleteRoleMessage: "Role not found." });
    }

    // Soft delete the role
    role.is_deleted = true;
    await role.save();

    return res
      .status(200)
      .json({ deleteRoleMessage: "Role deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      deleteRoleMessage: "Server error. Please try again later.",
      deleteRoleCatchBlkErr: error,
    });
  }
};

export {
  createRole,
  getAllRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  deleteRole,
};
