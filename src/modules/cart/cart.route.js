const express = require("express");
const router = express.Router();
const controller = require("./cart.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get("/", requireAuth, controller.get);
router.post("/items", requireAuth, controller.upsertItem);
router.delete("/items/:productId", requireAuth, controller.removeItem);

module.exports = router;
