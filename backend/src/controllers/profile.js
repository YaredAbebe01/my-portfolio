const Profile = require("../models/Profile");

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile || {});
  } catch (error) {
    next(error);
  }
};

const upsertProfile = async (req, res, next) => {
  try {
    const { imageUrl } = req.body || {};
    const profile = await Profile.findOneAndUpdate(
      {},
      { imageUrl },
      { new: true, upsert: true, runValidators: true },
    );
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  upsertProfile,
};
