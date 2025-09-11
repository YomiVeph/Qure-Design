import { Router } from "express";
import { authRouter } from "./auth.js";
import { appointmentRouter } from "./appointments.js";
import { queueRouter } from "./queues.js";
import { notificationRouter } from "./notifications.js";
import feedbackRouter from "./feedback.js";
import contactRouter from "./contact.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/appointments", appointmentRouter);
router.use("/queues", queueRouter);
router.use("/notifications", notificationRouter);
router.use("/feedback", feedbackRouter);
router.use("/contact", contactRouter);
