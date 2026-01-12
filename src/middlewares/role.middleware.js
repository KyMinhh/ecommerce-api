function requireRole(role) {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !role.includes(role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
}

module.exports = {
    requireRole
};