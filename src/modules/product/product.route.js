const express = require("express");
const router = express.Router();
const controller = require("./product.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/role.middleware");

// Public
router.get("/", controller.list);
router.get("/:id", controller.getOne);

// Admin only
router.post("/", requireAuth, requireRole("ADMIN"), controller.create);
router.patch("/:id", requireAuth, requireRole("ADMIN"), controller.update);
router.delete("/:id", requireAuth, requireRole("ADMIN"), controller.remove);

module.exports = router;
