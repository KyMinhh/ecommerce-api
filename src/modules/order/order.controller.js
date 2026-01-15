const orderService = require("./order.service");
const { updateOrderStatusSchema } = require("./order.schema");

async function checkout(req, res, next) {
    try {
        const userId = req.user.id;
        const result = await orderService.checkout(userId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

async function listMyOrders(req, res, next) {
    try {
        const userId = req.user.id;
        const { page, limit } = req.query;
        const result = await orderService.listOrdersByUser(userId, { page, limit });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

async function getMyOrder(req, res, next) {
    try {
        const userId = req.user.id;
        const orderId = Number(req.params.id);

        const result = await orderService.getOrderDetailForUser(userId, orderId);
        if (result === "FORBIDDEN") return res.status(403).json({ message: "Forbidden" });
        if (!result) return res.status(404).json({ message: "Order not found" });

        res.json(result);
    } catch (err) {
        next(err);
    }
}

async function adminUpdateStatus(req, res, next) {
    try {
        const orderId = Number(req.params.id);
        const { value, error } = updateOrderStatusSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const ok = await orderService.updateOrderStatus(orderId, value.status);
        if (!ok) return res.status(404).json({ message: "Order not found" });

        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

module.exports = { checkout, listMyOrders, getMyOrder, adminUpdateStatus };
