const express = require("express");
const router = express.Router();
const controller = require("./order.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.post("/", requireAuth, controller.checkout);

module.exports = router;
