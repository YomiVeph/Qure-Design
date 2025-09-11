import { Appointment } from "../models/Appointment.js";
import { Notification } from "../models/Notification.js";
import { z } from "zod";

// Validation schemas
const createAppointmentSchema = z.object({
  doctor: z.string().min(1, "Doctor name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  appointmentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid appointment date",
  }),
  appointmentTime: z.string().min(1, "Appointment time is required"),
  notes: z.string().optional(),
  hospitalName: z.string().optional(),
  patientInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    phoneNumber: z.string().min(10, "Valid phone number is required"),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
      message: "Valid gender selection is required",
    }),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date of birth",
    }),
  }),
});

const updateAppointmentSchema = z.object({
  doctor: z.string().min(1).optional(),
  specialty: z.string().min(1).optional(),
  appointmentDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)))
    .optional(),
  appointmentTime: z.string().min(1).optional(),
  notes: z.string().optional(),
  hospitalName: z.string().optional(),
});

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = createAppointmentSchema.parse(req.body);

    // Check if appointment date is in the future
    const appointmentDate = new Date(data.appointmentDate);
    if (appointmentDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future",
      });
    }

    const appointment = new Appointment({
      ...data,
      patient: userId,
      appointmentDate,
      patientInfo: {
        ...data.patientInfo,
        dateOfBirth: new Date(data.patientInfo.dateOfBirth),
      },
    });

    await appointment.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: "Appointment Scheduled",
      message: `Your appointment with ${
        data.doctor
      } on ${appointmentDate.toDateString()} at ${
        data.appointmentTime
      } has been scheduled.`,
      type: "appointment_confirmed",
      relatedEntity: {
        type: "appointment",
        id: appointment._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { patient: userId };
    if (status) {
      // Handle multiple status values (comma-separated)
      if (status.includes(",")) {
        const statusArray = status.split(",").map((s) => s.trim());
        query.status = { $in: statusArray };
      } else {
        query.status = status;
      }
    }

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const data = updateAppointmentSchema.parse(req.body);

    const appointment = await Appointment.findOne({
      _id: id,
      patient: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if appointment can be modified
    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot modify completed or cancelled appointments",
      });
    }

    // If date is being changed, validate it's in the future
    if (data.appointmentDate) {
      const newDate = new Date(data.appointmentDate);
      if (newDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Appointment date must be in the future",
        });
      }
      data.appointmentDate = newDate;
    }

    Object.assign(appointment, data);
    await appointment.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: "Appointment Updated",
      message: `Your appointment has been updated successfully.`,
      type: "appointment_confirmed",
      relatedEntity: {
        type: "appointment",
        id: appointment._id,
      },
    });

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Update appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointment",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: "Appointment Cancelled",
      message: `Your appointment with ${appointment.doctor} has been cancelled.`,
      type: "appointment_cancelled",
      relatedEntity: {
        type: "appointment",
        id: appointment._id,
      },
    });

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single appointment
export const getAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
