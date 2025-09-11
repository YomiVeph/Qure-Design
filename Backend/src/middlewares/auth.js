import { verifyAuthToken } from "../utils/jwt.js";

export function authenticateToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.substring(7) : null;

    console.log("=== Authentication Middleware ===");
    console.log("Authorization header:", header ? "Present" : "Missing");
    console.log("Token extracted:", token ? "Present" : "Missing");
    console.log("JWT_SECRET configured:", !!process.env.JWT_SECRET);

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ message: "Missing Authorization token" });
    }

    const decoded = verifyAuthToken(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully");
    console.log("Decoded payload:", decoded);

    req.user = {
      id: decoded.userId, // Map userId to id for consistency
      role: decoded.role,
      firstName: decoded.firstName,
    };
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
