import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Apply authentication middleware to all user routes
router.use(authenticateToken);

// Create User
router.post("/", async (req, res) => {
    try {
        const { name, email, age, gender, company, role } = req.body;
        const user = userRepository.create({ name, email, age, gender, company, role });
        await userRepository.save(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
});

// Get Users with Pagination, Search, Filter, and Sort
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.q as string;
        const gender = req.query.gender as string;
        const ageRange = req.query.ageRange as string;
        const sortBy = (req.query.sortBy as string) || "createdAt";
        const order = (req.query.order as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

        const skip = (page - 1) * limit;

        const queryBuilder = userRepository.createQueryBuilder("user");

        if (search) {
            queryBuilder.andWhere("(user.name ILIKE :search OR user.email ILIKE :search)", { search: `%${search}%` });
        }

        if (gender && gender !== "All") {
            queryBuilder.andWhere("user.gender = :gender", { gender });
        }

        if (ageRange && ageRange !== "All") {
            if (ageRange === "18-25") {
                queryBuilder.andWhere("user.age >= 18 AND user.age <= 25");
            } else if (ageRange === "26-35") {
                queryBuilder.andWhere("user.age >= 26 AND user.age <= 35");
            } else if (ageRange === "36-45") {
                queryBuilder.andWhere("user.age >= 36 AND user.age <= 45");
            } else if (ageRange === "46+") {
                queryBuilder.andWhere("user.age >= 46");
            }
        }

        queryBuilder.orderBy(`user.${sortBy}`, order as "ASC" | "DESC");
        queryBuilder.skip(skip).take(limit);

        const [users, total] = await queryBuilder.getManyAndCount();

        res.json({
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Update User
router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email, age, gender, company, role } = req.body;
        
        let user = await userRepository.findOneBy({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name;
        user.email = email;
        user.age = age;
        user.gender = gender;
        user.company = company;
        user.role = role;

        await userRepository.save(user);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
    }
});

// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userRepository.findOneBy({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        await userRepository.remove(user);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

export default router;
