import mongoose, { Schema, Document } from "mongoose";

export interface IKestraEvent extends Document {
  eventId: string;
  flowId: string;
  executionId: string;
  eventType: string; // running | success | failure
  payload: any;
  raw: any; // full webhook body
  createdAt: Date;
}

const KestraEventSchema = new Schema<IKestraEvent>(
  {
    eventId: { type: String, required: true, unique: true },
    flowId: { type: String, required: true },
    executionId: { type: String, required: true },
    eventType: { type: String, required: true },
    payload: { type: Object, required: true },
    raw: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.KestraEvent ||
  mongoose.model<IKestraEvent>("KestraEvent", KestraEventSchema);
