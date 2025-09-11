import { Queue } from "../models/Queue.js";
import { Notification } from "../models/Notification.js";
import { z } from "zod";

// Validation schemas
const joinQueueSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  notes: z.string().optional(),
  priority: z.enum(["normal", "urgent", "emergency"]).default("normal"),
});

// Join queue
export const joinQueue = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = joinQueueSchema.parse(req.body);

    // Check if user is already in a queue
    const existingQueue = await Queue.findOne({
      patient: userId,
      status: { $in: ["waiting", "called"] },
    });

    if (existingQueue) {
      return res.status(400).json({
        success: false,
        message: "You are already in a queue",
        data: existingQueue,
      });
    }

    // Get the next position in the queue
    const lastQueue = await Queue.findOne({
      hospitalName: data.hospitalName,
      specialty: data.specialty,
      status: "waiting",
    }).sort({ position: -1 });

    const nextPosition = lastQueue ? lastQueue.position + 1 : 1;
    const queueNumber = `${data.specialty.charAt(0).toUpperCase()}-${String(
      nextPosition
    ).padStart(3, "0")}`;

    // Calculate estimated wait time (rough estimate: 15 minutes per person)
    const estimatedWaitTime = (nextPosition - 1) * 15;

    const queue = new Queue({
      ...data,
      patient: userId,
      position: nextPosition,
      queueNumber,
      estimatedWaitTime,
    });

    await queue.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: "Joined Queue",
      message: `You have joined the ${data.specialty} queue at ${data.hospitalName}. Your queue number is ${queueNumber}.`,
      type: "queue_update",
      relatedEntity: {
        type: "queue",
        id: queue._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Successfully joined the queue",
      data: queue,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Join queue error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's queue status
export const getQueueStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const queue = await Queue.findOne({
      patient: userId,
      status: { $in: ["waiting", "called"] },
    }).populate("patient", "firstName lastName email phone");

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "You are not currently in any queue",
      });
    }

    // Get queue statistics
    const totalInQueue = await Queue.countDocuments({
      hospitalName: queue.hospitalName,
      specialty: queue.specialty,
      status: "waiting",
    });

    const aheadInQueue = await Queue.countDocuments({
      hospitalName: queue.hospitalName,
      specialty: queue.specialty,
      status: "waiting",
      position: { $lt: queue.position },
    });

    // Update estimated wait time
    const updatedWaitTime = aheadInQueue * 15;
    queue.estimatedWaitTime = updatedWaitTime;
    await queue.save();

    res.json({
      success: true,
      data: {
        ...queue.toObject(),
        queueStats: {
          totalInQueue,
          aheadInQueue,
          estimatedWaitTime: updatedWaitTime,
        },
      },
    });
  } catch (error) {
    console.error("Get queue status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Leave queue
export const leaveQueue = async (req, res) => {
  try {
    const userId = req.user.id;

    const queue = await Queue.findOne({
      patient: userId,
      status: { $in: ["waiting", "called"] },
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "You are not currently in any queue",
      });
    }

    // Update queue status
    queue.status = "cancelled";
    await queue.save();

    // Update positions of remaining patients
    await Queue.updateMany(
      {
        hospitalName: queue.hospitalName,
        specialty: queue.specialty,
        status: "waiting",
        position: { $gt: queue.position },
      },
      { $inc: { position: -1 } }
    );

    // Create notification
    await Notification.create({
      user: userId,
      title: "Left Queue",
      message: `You have left the ${queue.specialty} queue at ${queue.hospitalName}.`,
      type: "queue_update",
      relatedEntity: {
        type: "queue",
        id: queue._id,
      },
    });

    res.json({
      success: true,
      message: "Successfully left the queue",
      data: queue,
    });
  } catch (error) {
    console.error("Leave queue error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get queue history
export const getQueueHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const queues = await Queue.find({ patient: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Queue.countDocuments({ patient: userId });

    res.json({
      success: true,
      data: {
        queues,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get queue history error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get hospital queues (for staff)
export const getHospitalQueues = async (req, res) => {
  try {
    const { hospitalName, specialty } = req.query;

    if (!hospitalName) {
      return res.status(400).json({
        success: false,
        message: "Hospital name is required",
      });
    }

    const query = { hospitalName, status: "waiting" };
    if (specialty) {
      query.specialty = specialty;
    }

    const queues = await Queue.find(query)
      .populate("patient", "firstName lastName email phone")
      .sort({ position: 1 })
      .lean();

    res.json({
      success: true,
      data: queues,
    });
  } catch (error) {
    console.error("Get hospital queues error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Call next patient (for staff)
export const callNextPatient = async (req, res) => {
  try {
    const { hospitalName, specialty } = req.body;

    if (!hospitalName || !specialty) {
      return res.status(400).json({
        success: false,
        message: "Hospital name and specialty are required",
      });
    }

    // Find the next patient in queue
    const nextPatient = await Queue.findOne({
      hospitalName,
      specialty,
      status: "waiting",
    }).populate("patient", "firstName lastName email phone");

    if (!nextPatient) {
      return res.status(404).json({
        success: false,
        message: "No patients in queue",
      });
    }

    // Update patient status to called
    nextPatient.status = "called";
    nextPatient.calledAt = new Date();
    await nextPatient.save();

    // Create notification for patient
    await Notification.create({
      user: nextPatient.patient._id,
      title: "You're Next!",
      message: `You have been called for your ${specialty} appointment at ${hospitalName}. Please proceed to the consultation room.`,
      type: "queue_update",
      priority: "urgent",
      relatedEntity: {
        type: "queue",
        id: nextPatient._id,
      },
    });

    res.json({
      success: true,
      message: "Next patient called successfully",
      data: nextPatient,
    });
  } catch (error) {
    console.error("Call next patient error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all queue data for public viewing (patients can see all queues)
export const getAllQueues = async (req, res) => {
  try {
    const { hospitalName, specialty } = req.query;

    console.log("=== GetAllQueues Debug ===");
    console.log("Query params:", { hospitalName, specialty });

    // If no hospital specified, show all hospitals
    const query = {
      // Temporarily remove status filter to see all queues
    };

    if (hospitalName) {
      query.hospitalName = hospitalName;
    }

    if (specialty) {
      query.specialty = specialty;
    }

    console.log("MongoDB query:", query);

    const queues = await Queue.find(query)
      .populate("patient", "firstName lastName") // Only show first and last name for privacy
      .sort({ position: 1 })
      .lean();

    console.log("Found queues:", queues.length);
    console.log("Queue data:", queues);

    // Format the data for public display
    const formattedQueues = queues.map((queue) => ({
      id: queue._id,
      queueNumber: queue.queueNumber,
      position: queue.position,
      specialty: queue.specialty,
      hospitalName: queue.hospitalName,
      status: queue.status,
      estimatedWaitTime: queue.estimatedWaitTime,
      joinedAt: queue.createdAt,
      patientName: queue.patient
        ? `${queue.patient.firstName} ${queue.patient.lastName}`
        : "Unknown",
      // Don't expose sensitive patient data like email, phone, etc.
    }));

    console.log("Formatted queues:", formattedQueues);
    console.log("Response data length:", formattedQueues.length);

    res.json({
      success: true,
      data: formattedQueues,
    });
  } catch (error) {
    console.error("Get all queues error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Temporary debug endpoint to see all queues in database
export const debugAllQueues = async (req, res) => {
  try {
    console.log("=== Debug All Queues ===");

    // Get all queues without any filters
    const allQueues = await Queue.find({})
      .populate("patient", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Total queues in database:", allQueues.length);
    console.log("All queues:", allQueues);

    res.json({
      success: true,
      total: allQueues.length,
      data: allQueues,
    });
  } catch (error) {
    console.error("Debug all queues error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
