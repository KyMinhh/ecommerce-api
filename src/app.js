const express = require("express");
const app = express();
const pool = require("./config/database");
const authRoutes = require("./modules/auth/auth.route");
const { requireAuth } = require("./middlewares/auth.middleware");
const { requireRole } = require("./middlewares/role.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome to the E-commerce API");
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.get("/health/db", async (req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        res.json({
            db: rows[0].ok === 1 ? "OK" : "NOT_OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        next(err);
    }
});

app.get("/api/me", requireAuth, (req, res) =>{
    res.json({ user: req.user });
});

app.get("/api/admin/ping", requireAuth, requireRole("ADMIN"), (req, res) => {
    res.json({ message: "Welcome, admin user!", ok: true });
});

app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    if (status >= 500) {
        console.error(err);
        res.status(status).json({ message });
    }
});


module.exports = app;
