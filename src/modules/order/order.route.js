const express = require("express");
const router = express.Router();
const controller = require("./order.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/role.middleware");

router.post("/", requireAuth, controller.checkout);

router.get("/", requireAuth, controller.listMyOrders);
router.get("/:id", requireAuth, controller.getMyOrder);

router.patch("/:id/status", requireAuth, requireRole("admin"), controller.adminUpdateStatus);

module.exports = router;
