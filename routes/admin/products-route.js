const express = require("express");
const router = express.Router();
const {
  handleImageUpload,
} = require("../../controllers/admin/products-controller");
const { upload } = require("../../helper/cloudinary");

router.post("/upload-image", upload.single("my_file"), handleImageUpload);

module.exports = router;
