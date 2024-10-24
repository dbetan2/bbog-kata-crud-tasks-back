import express, { Router } from "express";
import taskController from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth";

const router: Router = express.Router();

router.use(authenticateToken);

router.post("/", taskController.create);
router.get("/", taskController.getAll);
router.get("/:id", taskController.getOne);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.delete);
router.delete("/", taskController.deleteAll);

export default router;
