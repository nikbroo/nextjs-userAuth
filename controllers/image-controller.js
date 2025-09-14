const { uploadToCloudinary } = require("../helper/cloudinaryHelper");
const Image = require("../models/image");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "File Uploaded",
      data: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchAllImages = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images) {
      res.status(200).json({
        success: true,
        message: "done",
        images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { uploadImage, fetchAllImages };
