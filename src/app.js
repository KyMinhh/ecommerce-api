const express = require("express");
const app = express();
const pool = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


module.exports = app;
