// src/models/LogEntry.model.ts
import mongoose, { Schema, model, Model, Document } from "mongoose";

export interface ILogEntry extends Document {
  userId?: string;
  rawText: string;
  summary?: string;
  classification?: string;
  source?: "manual" | "kestra" | "webhook" | "api";
  createdAt: Date;
  updatedAt: Date;
}

const LogEntrySchema = new Schema<ILogEntry>(
  {
    userId: { type: String, required: false },
    rawText: { type: String, required: true },
    summary: { type: String },
    classification: { type: String },
    source: {
      type: String,
      enum: ["manual", "kestra", "webhook", "api"],
      default: "manual",
    },
  },
  { timestamps: true }
);

LogEntrySchema.index({ createdAt: -1 });
LogEntrySchema.index({ source: 1 });
LogEntrySchema.index({ classification: 1 });

// Use Model<ILogEntry> type
export const LogEntry: Model<ILogEntry> =
  mongoose.models.LogEntry || model<ILogEntry>("LogEntry", LogEntrySchema);
