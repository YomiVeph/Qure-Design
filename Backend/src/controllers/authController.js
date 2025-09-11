import bcrypt from "bcrypt";
import { z } from "zod";
import crypto from "crypto";
import { User } from "../models/User.js";
import { signAuthToken } from "../utils/jwt.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email.js";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  password: z.string().min(8),
  role: z.enum(["patient", "staff"]),
  hospitalName: z.string().optional(),
});

const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(8),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function register(req, res) {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      hospitalName: data.role === "staff" ? data.hospitalName : undefined,
    });

    const token = signAuthToken(
      { userId: user.id, role: user.role, firstName: user.firstName },
      process.env.JWT_SECRET
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.firstName);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        hospitalName: user.hospitalName,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: err.errors });
    }
    return res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { emailOrPhone, password } = loginSchema.parse(req.body);
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signAuthToken(
      { userId: user.id, role: user.role, firstName: user.firstName },
      process.env.JWT_SECRET
    );
    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        hospitalName: user.hospitalName,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: err.errors });
    }
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message:
          "If an account with that email exists, we've sent a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Still return success to user for security (don't reveal email issues)
    }

    return res.json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid email", errors: err.errors });
    }
    return res.status(500).json({ message: "Password reset request failed" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: err.errors });
    }
    return res.status(500).json({ message: "Password reset failed" });
  }
}
