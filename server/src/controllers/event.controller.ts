import { Response } from "express";
import Event from "../models/Event.model";
import { createEventSchema } from "../schemas/event.schema";
import { sendEmail } from "../services/email.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });
    return;
  }

  const { email, date, description } = result.data;

  const event = await Event.create({ email, date, description });

  // Trigger email — jika gagal, log error tapi data tetap tersimpan
  try {
    await sendEmail(email);
  } catch (err) {
    console.error("Failed to send email, but event saved:", err);
  }

  res.status(201).json(event);
};

export const getEvents = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  const events = await Event.find().sort({ date: 1 });

  res.json(events);
};

export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  res.json({ message: "Event deleted successfully" });
};
