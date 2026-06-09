import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin user from the PDF requirements
    if (email === "admin@test.com" && password === "admin123") {
        const token = jwt.sign(
            { email, role: "admin" },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "1d" }
        );

        return res.json({ token, message: "Login successful" });
    }

    return res.status(401).json({ message: "Invalid email or password" });
});

export default router;
