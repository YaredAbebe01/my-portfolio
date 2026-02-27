const Admin = require("../models/Admin");

const listAdminRequests = async (req, res, next) => {
  try {
    const admins = await Admin.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

const approveAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    next(error);
  }
};

const rejectAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true },
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listAdminRequests,
  approveAdmin,
  rejectAdmin,
};
