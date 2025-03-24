const Product = require("../../models/Product");
const getFilterdProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

module.exports = { getFilterdProducts };
