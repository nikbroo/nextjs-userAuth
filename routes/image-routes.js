const express = require("express");
const {
  uploadImage,
  fetchAllImages,
} = require("../controllers/image-controller");
const authMiddleware = require("../middleware/auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

router.get("/get", authMiddleware, fetchAllImages);

module.exports = router;
