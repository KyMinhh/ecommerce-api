const pool = require("../../config/database");

async function createProduct(data) {
  const { name, price, stock, description, isActive } = data;

  const [result] = await pool.query(
    `INSERT INTO products (name, price, stock, description, image_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, stock, description ?? null, data.imageUrl ?? null, isActive ?? true]
  );

  return getProductById(result.insertId);
}

async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, price, stock, description, image_url AS imageUrl, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt
     FROM products WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function listProducts({ page = 1, limit = 10, q = "" }) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;
  const keyword = `%${q}%`;

  const where = q ? "WHERE name LIKE ?" : "";
  const params = q ? [keyword] : [];

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total FROM products ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT id, name, price, stock, description, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt
     FROM products ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset]
  );

  return {
    page: safePage,
    limit: safeLimit,
    total: countRow.total,
    items: rows,
  };
}

async function updateProduct(id, data) {
  const fields = [];
  const values = [];

  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.price !== undefined) { fields.push("price = ?"); values.push(data.price); }
  if (data.stock !== undefined) { fields.push("stock = ?"); values.push(data.stock); }
  if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
  if (data.isActive !== undefined) { fields.push("is_active = ?"); values.push(data.isActive); }

  if (fields.length === 0) return getProductById(id);

  values.push(id);
  const [result] = await pool.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) return null;
  return getProductById(id);
}

async function deleteProduct(id) {
  const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { createProduct, getProductById, listProducts, updateProduct, deleteProduct };
