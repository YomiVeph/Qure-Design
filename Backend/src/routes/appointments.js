import express from "express";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import {
  createAppointment,
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
  getAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Patient routes
router.post("/", requireRole("patient"), createAppointment);
router.get("/", requireRole("patient"), getUserAppointments);
router.get("/:id", requireRole("patient"), getAppointment);
router.put("/:id", requireRole("patient"), updateAppointment);
router.delete("/:id", requireRole("patient"), cancelAppointment);

export { router as appointmentRouter };
