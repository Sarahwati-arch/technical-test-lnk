import { Router } from "express";
import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
