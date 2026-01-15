const pool = require("../../config/database");

async function checkout(userId) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [[cart]] = await conn.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
        if (!cart) {
            const err = new Error("Cart not found");
            err.status = 404;
            throw err;
        }

        const [items] = await conn.query(
            `SELECT ci.product_id AS productId, ci.quantity, p.name, p.price, p.stock, p.is_active
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?
       FOR UPDATE`,
            [cart.id]
        );

        if (items.length === 0) {
            const err = new Error("Cart is empty");
            err.status = 400;
            throw err;
        }

        // Validate stock & active
        for (const it of items) {
            if (it.is_active !== 1) {
                const err = new Error(`Product inactive: ${it.productId}`);
                err.status = 400;
                throw err;
            }
            if (it.stock < it.quantity) {
                const err = new Error(`Not enough stock: ${it.productId}`);
                err.status = 400;
                throw err;
            }
        }

        const total = items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);

        const [orderRes] = await conn.query(
            "INSERT INTO orders (user_id, status, total) VALUES (?, 'PENDING', ?)",
            [userId, total]
        );
        const orderId = orderRes.insertId;

        for (const it of items) {
            const lineTotal = Number(it.price) * it.quantity;

            await conn.query(
                `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, it.productId, it.name, it.price, it.quantity, lineTotal]
            );

            await conn.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [it.quantity, it.productId]
            );
        }

        await conn.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);

        await conn.commit();
        return { orderId, total };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = { checkout };
