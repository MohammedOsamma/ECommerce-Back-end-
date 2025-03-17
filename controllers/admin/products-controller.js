const { imageUploadUtil } = require("../../helper/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "error occured",
    });
  }
};

module.exports = { handleImageUpload };
