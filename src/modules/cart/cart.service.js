const pool = require("../../config/database");

async function ensureCart(userId) {
    const [rows] = await pool.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
    if (rows.length) return rows[0].id;

    const [result] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
    return result.insertId;
}

async function getCart(userId) {
    const cartId = await ensureCart(userId);

    const [items] = await pool.query(
        `SELECT ci.product_id AS productId, ci.quantity,
            p.name, p.price, p.image_url AS imageUrl, p.is_active AS isActive
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ?
     ORDER BY ci.updated_at DESC`,
        [cartId]
    );

    return { cartId, items };
}

async function upsertItem(userId, { productId, quantity }) {
    const cartId = await ensureCart(userId);

    // Check product exists + active
    const [pRows] = await pool.query(
        "SELECT id, stock, is_active FROM products WHERE id = ? LIMIT 1",
        [productId]
    );
    if (!pRows.length) {
        const err = new Error("Product not found");
        err.status = 404;
        throw err;
    }
    if (pRows[0].is_active !== 1) {
        const err = new Error("Product is inactive");
        err.status = 400;
        throw err;
    }
    if (pRows[0].stock < quantity) {
        const err = new Error("Not enough stock");
        err.status = 400;
        throw err;
    }

    await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
        [cartId, productId, quantity]
    );

    return getCart(userId);
}

async function removeItem(userId, productId) {
    const cartId = await ensureCart(userId);
    await pool.query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cartId, productId]);
    return getCart(userId);
}

module.exports = { getCart, upsertItem, removeItem };
