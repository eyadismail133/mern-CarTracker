import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protect(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = id;
    // Attach user object with role to req
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
