import express from "express";
import { authenticateToken, requireRole } from "../middlewares/auth.js";
import {
  joinQueue,
  getQueueStatus,
  leaveQueue,
  getQueueHistory,
  getHospitalQueues,
  callNextPatient,
  getAllQueues,
  debugAllQueues,
} from "../controllers/queueController.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Patient routes
router.post("/join", requireRole("patient"), joinQueue);
router.get("/status", requireRole("patient"), getQueueStatus);
router.delete("/leave", requireRole("patient"), leaveQueue);
router.get("/history", requireRole("patient"), getQueueHistory);
router.get("/all", requireRole("patient"), getAllQueues); // Public queue view for patients
router.get("/debug", requireRole("patient"), debugAllQueues); // Debug endpoint

// Staff routes
router.get("/hospital", requireRole("staff"), getHospitalQueues);
router.post("/call-next", requireRole("staff"), callNextPatient);

export { router as queueRouter };
