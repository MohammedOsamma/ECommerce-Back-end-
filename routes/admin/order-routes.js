const express = require("express");
const router = express.Router();
const {
  getAllOrderOfAllUser,
} = require("../../controllers/admin/order-controller");

router.get("/get", getAllOrderOfAllUser);

module.exports = router;
