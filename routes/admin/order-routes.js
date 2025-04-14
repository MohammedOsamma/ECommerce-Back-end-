const express = require("express");
const router = express.Router();
const {
  getAllOrderOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

router.get("/get", getAllOrderOfAllUser);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
