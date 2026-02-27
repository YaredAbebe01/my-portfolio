const Hackathon = require("../models/Hackathon");

const getHackathons = async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find().sort({ updatedAt: -1, createdAt: -1 });
    res.json(hackathons);
  } catch (error) {
    next(error);
  }
};

const createHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (error) {
    next(error);
  }
};

const updateHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.json(hackathon);
  } catch (error) {
    next(error);
  }
};

const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHackathons,
  createHackathon,
  updateHackathon,
  deleteHackathon,
};
