const Link = require("../models/Link");

const getLinks = async (req, res, next) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    next(error);
  }
};

const createLink = async (req, res, next) => {
  try {
    const link = await Link.create(req.body);
    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
};

const updateLink = async (req, res, next) => {
  try {
    const link = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const trackLink = async (req, res, next) => {
  try {
    const { id, label } = req.body;

    if (!id && !label) {
      return res.status(400).json({ message: "Link id or label is required" });
    }

    const query = id
      ? { _id: id }
      : { label: new RegExp(`^${String(label).trim()}$`, "i") };

    const link = await Link.findOneAndUpdate(query, { $inc: { clicks: 1 } }, { new: true });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Tracked" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  trackLink,
};
