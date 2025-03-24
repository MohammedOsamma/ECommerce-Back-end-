const express = require("express");
const router = express.Router();
const {
  getFilterdProducts,
} = require("../../controllers/shop/products-controller");

router.get("/get", getFilterdProducts);

module.exports = router;
