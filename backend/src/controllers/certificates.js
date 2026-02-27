const Certificate = require("../models/Certificate");

const getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ updatedAt: -1, createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

const createCertificate = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    let nextOrder = payload.order;

    if (nextOrder === undefined || nextOrder === null || Number.isNaN(Number(nextOrder))) {
      const lastCertificate = await Certificate.findOne()
        .sort({ order: -1, createdAt: -1 })
        .select("order");
      nextOrder = typeof lastCertificate?.order === "number" ? lastCertificate.order + 1 : 0;
    } else {
      nextOrder = Number(nextOrder);
    }

    const certificate = await Certificate.create({ ...payload, order: nextOrder });
    res.status(201).json(certificate);
  } catch (error) {
    next(error);
  }
};

const updateCertificate = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.order !== undefined && payload.order !== null) {
      payload.order = Number(payload.order);
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    next(error);
  }
};

const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
