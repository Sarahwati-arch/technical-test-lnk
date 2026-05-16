import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  email: string;
  date: string;
  description: string;
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
