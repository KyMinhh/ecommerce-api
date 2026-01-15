const orderService = require("./order.service");

async function checkout(req, res, next) {
    try {
        const userId = req.user.id;
        const result = await orderService.checkout(userId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { checkout };
