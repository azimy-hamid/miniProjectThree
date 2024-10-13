import Fees from "../models/Fees.js";
import Students from "../models/Students.js";

// Create a new fee record
const createFee = async (req, res) => {
  const {
    student_id_fk,
    fee_type,
    fee_amount,
    due_date,
    payment_status,
    payment_date,
    penalty,
    discounts,
    payment_mode,
    semester,
    year,
  } = req.body;

  // Validate required input
  if (!student_id_fk || !fee_type || !fee_amount || !due_date || !semester) {
    return res.status(400).json({
      createFeeMessage:
        "Student ID, Fee Type, Fee Amount, Due Date, and Semester are required.",
    });
  }

  // Validate that the student exists
  const student = await Students.findOne({
    where: { student_id_pk: student_id_fk },
    paranoid: false, // Include soft-deleted records
  });

  if (!student) {
    return res.status(404).json({
      createFeeMessage: "Student not found.",
    });
  }

  // Check if the student is deleted
  if (student.is_deleted) {
    return res.status(400).json({
      createFeeMessage: "Student has been deleted.",
    });
  }

  try {
    const newFee = await Fees.create({
      student_id_fk,
      fee_type,
      fee_amount,
      due_date,
      payment_status,
      payment_date,
      penalty,
      discounts,
      payment_mode,
      semester,
      year,
    });

    return res.status(201).json({
      createFeeMessage: "Fee record created successfully!",
      newFee,
    });
  } catch (error) {
    console.error("Error creating fee record:", error);
    return res.status(500).json({
      createFeeMessage: "Server error. Please try again later.",
      createFeeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get all fee records
const getAllFees = async (req, res) => {
  try {
    const fees = await Fees.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
        },
      ],
    });

    return res.status(200).json({
      getAllFeesMessage: "Fee records retrieved successfully!",
      fees,
    });
  } catch (error) {
    console.error("Error retrieving fee records:", error);
    return res.status(500).json({
      getAllFeesMessage: "Server error. Please try again later.",
      getAllFeesCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Get a single fee record by ID
const getFeeById = async (req, res) => {
  const { feeId } = req.params;

  try {
    const fee = await Fees.findOne({
      where: { fee_id_pk: feeId, is_deleted: false },
      include: [
        {
          model: Students,
          as: "student",
        },
      ],
    });

    if (!fee) {
      return res.status(404).json({
        getFeeMessage: "Fee record not found or deleted.",
      });
    }

    return res.status(200).json({
      getFeeMessage: "Fee record retrieved successfully!",
      fee,
    });
  } catch (error) {
    console.error("Error retrieving fee record:", error);
    return res.status(500).json({
      getFeeMessage: "Server error. Please try again later.",
      getFeeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Update a fee record
const updateFee = async (req, res) => {
  const { feeId } = req.params;
  const {
    fee_type,
    fee_amount,
    due_date,
    payment_status,
    payment_date,
    penalty,
    discounts,
    payment_mode,
    semester,
    year,
  } = req.body;

  try {
    const fee = await Fees.findOne({
      where: { fee_id_pk: feeId, is_deleted: false },
    });

    if (!fee) {
      return res.status(404).json({
        updateFeeMessage: "Fee record not found or deleted.",
      });
    }

    // Update fields
    if (fee_type) fee.fee_type = fee_type;
    if (fee_amount) fee.fee_amount = fee_amount;
    if (due_date) fee.due_date = due_date;
    if (payment_status) fee.payment_status = payment_status;
    if (payment_date) fee.payment_date = payment_date;
    if (penalty) fee.penalty = penalty;
    if (discounts) fee.discounts = discounts;
    if (payment_mode) fee.payment_mode = payment_mode;
    if (semester) fee.semester = semester;
    if (year) fee.year = year;

    await fee.save();

    return res.status(200).json({
      updateFeeMessage: "Fee record updated successfully!",
      fee,
    });
  } catch (error) {
    console.error("Error updating fee record:", error);
    return res.status(500).json({
      updateFeeMessage: "Server error. Please try again later.",
      updateFeeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Delete a fee record
const deleteFee = async (req, res) => {
  const { feeId } = req.params;

  try {
    const fee = await Fees.findOne({
      where: { fee_id_pk: feeId, is_deleted: false },
    });

    if (!fee) {
      return res.status(404).json({
        deleteFeeMessage: "Fee record not found or already deleted.",
      });
    }

    // Soft delete the fee record
    fee.is_deleted = true;
    await fee.save();

    return res.status(200).json({
      deleteFeeMessage: "Fee record deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    return res.status(500).json({
      deleteFeeMessage: "Server error. Please try again later.",
      deleteFeeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

// Recover a deleted fee record
const recoverFee = async (req, res) => {
  const { feeId } = req.params;

  try {
    const fee = await Fees.findOne({
      where: { fee_id_pk: feeId, is_deleted: true },
    });

    if (!fee) {
      return res.status(404).json({
        recoverFeeMessage: "Fee record not found or not deleted.",
      });
    }

    // Restore the fee record
    fee.is_deleted = false;
    await fee.save();

    return res.status(200).json({
      recoverFeeMessage: "Fee record recovered successfully!",
      fee,
    });
  } catch (error) {
    console.error("Error recovering fee record:", error);
    return res.status(500).json({
      recoverFeeMessage: "Server error. Please try again later.",
      recoverFeeCatchBlkErr: error.message || "Unknown error",
    });
  }
};

export { createFee, getAllFees, getFeeById, updateFee, deleteFee, recoverFee };
