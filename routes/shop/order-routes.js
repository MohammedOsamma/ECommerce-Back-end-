const express = require("express");
const router = express.Router();
const { createOrder } = require("../../controllers/shop/order-controller");

router.post("/create", createOrder);

module.exports = router;
