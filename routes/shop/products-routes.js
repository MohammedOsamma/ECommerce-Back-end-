const express = require("express");
const router = express.Router();
const {
  getFilterdProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

router.get("/get", getFilterdProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;
