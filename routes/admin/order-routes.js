const express = require("express");
const router = express.Router();
const {
  getAllOrderOfAllUser,
  getOrderDetailsForAdmin,
} = require("../../controllers/admin/order-controller");

router.get("/get", getAllOrderOfAllUser);
router.get("/details/:id", getOrderDetailsForAdmin);

module.exports = router;
