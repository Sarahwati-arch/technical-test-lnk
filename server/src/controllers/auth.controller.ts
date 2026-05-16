import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";
import AuditLog from "../models/AuditLog.model";
import { loginSchema } from "../schemas/auth.schema";
import { AuthRequest } from "../middlewares/auth.middleware";

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });
    return;
  }

  const { username, password } = result.data;

  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  await AuditLog.create({
    userId: user._id,
    action: "LOGIN",
    ip_address: req.ip || "",
    user_agent: req.headers["user-agent"] || "",
  });

  res.json({ token });
};

export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  await AuditLog.create({
    userId: req.userId,
    action: "LOGOUT",
    ip_address: req.ip || "",
    user_agent: req.headers["user-agent"] || "",
  });

  res.json({ message: "Logout successful" });
};
