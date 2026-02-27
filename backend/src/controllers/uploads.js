const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const folder = process.env.CLOUDINARY_FOLDER || "portfolio";
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          timeout: 120000,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(uploadResult);
        },
      );

      Readable.from(req.file.buffer).pipe(stream);
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { uploadImage };
