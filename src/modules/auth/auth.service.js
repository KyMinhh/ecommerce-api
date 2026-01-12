const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register({ email, password, fullName }) {
    const [exist] = await pool.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (exist.length > 0) {
        const error = new Error("Email already in use");
        error.status = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, fullName || null, "user"]
    );

    return { id: result.insertId, email, fullName: fullName || null, role: "user" };
}

async function login({ email, password }) {
    const [rows] = await pool.query(
        "SELECT id, email, password_hash, full_name, role FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (rows.length === 0) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    return { token, user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role } };
}

module.exports = { register, login };