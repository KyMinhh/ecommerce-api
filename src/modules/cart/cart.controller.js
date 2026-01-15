const { upsertCartItemSchema } = require("./cart.schema");
const cartService = require("./cart.service");

async function get(req, res, next) {
    try {
        const userId = req.user.id;
        console.log("UserID", userId);
        const cart = await cartService.getCart(userId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
}

async function upsertItem(req, res, next) {
    try {
        const { value, error } = upsertCartItemSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const userId = req.user.id;
        const cart = await cartService.upsertItem(userId, value);
        console.log(cart);
        console.log(userId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
}

async function removeItem(req, res, next) {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);
        const cart = await cartService.removeItem(userId, productId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
}

module.exports = { get, upsertItem, removeItem };
