const { imageUploadUtil } = require("../../helper/cloudinary");
const Product = require("../../models/Product");

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

// add new product

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await newlyCreatedProduct.save();
    res.status(200).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured ",
    });
  }
};
// fetch all product
const fetchAllProducts = async (req, res) => {
  const listOfProducts = await Product.find({});
  res.status(200).json({
    success: true,
    data: listOfProducts,
  });
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured ",
    });
  }
};
// edit product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProdcut = await Product.findById(id);

    if (!findProdcut)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    findProdcut.title = title || findProdcut.title;
    findProdcut.description = description || findProdcut.description;
    findProdcut.category = category || findProdcut.category;
    findProdcut.brand = brand || findProdcut.brand;
    findProdcut.price = price || findProdcut.price;
    findProdcut.salePrice = salePrice || findProdcut.salePrice;
    findProdcut.totalStock = totalStock || findProdcut.totalStock;
    findProdcut.image = image || findProdcut.image;

    await findProdcut.save();
    res.status(200).json({ success: true, data: findProdcut });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured ",
    });
  }
};
// delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error Occured ",
    });
  }
};
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
