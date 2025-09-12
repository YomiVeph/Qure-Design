import { Router } from "express";
import { authRouter } from "./auth.js";
import { appointmentRouter } from "./appointments.js";
import { queueRouter } from "./queues.js";
import { notificationRouter } from "./notifications.js";
import feedbackRouter from "./feedback.js";
import contactRouter from "./contact.js";
import { accessCodeRouter } from "./accessCodes.js";
import { hospitalRouter } from "./hospitals.js";
import { waitingRoomRouter } from "./waitingRooms.js";
import messageRouter from "./messages.js";
import { settingsRouter } from "./settings.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/appointments", appointmentRouter);
router.use("/queues", queueRouter);
router.use("/notifications", notificationRouter);
router.use("/feedback", feedbackRouter);
router.use("/contact", contactRouter);
router.use("/access-codes", accessCodeRouter);
router.use("/hospitals", hospitalRouter);
router.use("/waiting-rooms", waitingRoomRouter);
router.use("/messages", messageRouter);
router.use("/settings", settingsRouter);
