const {registerSchema, loginSchema} = require("./auth.schema");
const authService = require("./auth.service");

async function register(req, res, next) {
    try {
        const {value, error} = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await authService.register(value);
        res.status(201).json({ user });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const {value, error} = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const result = await authService.login(value);
        res.json(result);
    } catch (err) {
        next(err);
    }
}
module.exports = { register, login };