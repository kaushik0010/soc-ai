// models/Incident.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { Incident } from "@/types/incident"; // Import the Zod type

// Define Mongoose Schema for IOC
const IocMongooseSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["ip", "domain", "hash", "user", "file_path"],
      required: true,
    },
    value: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 100, default: 75 },
  },
  { _id: false } // No separate ID needed for subdocument
);

// Define Mongoose Schema for SuggestedAction
const SuggestedActionMongooseSchema = new Schema(
  {
    actionId: { type: String, required: true },
    type: {
      type: String,
      enum: ["block_ip", "disable_user", "isolate_host", "create_ticket"],
      required: true,
    },
    target: { type: String, required: true },
    justification: { type: String, required: true },
    kestraFlowId: { type: String },
  },
  { _id: false }
);

// Define Mongoose Schema for MitreTechnique
const MitreTechniqueMongooseSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 75,
  }
}, { _id: false });

// Define Primary Incident Schema
const IncidentSchema = new Schema<Incident & Document>(
  {
    incidentId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical", "Informational"],
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Triaged", "Investigating", "Contained", "Closed"],
      default: "New",
    },
    summary: { type: String, required: true },
    // Link logs via their IDs
    logEntryIds: [{ type: Schema.Types.ObjectId, ref: "LogEntry" }],

    // 🚨 Consistency Fix: Apply required: true, default: [] to all array subdocuments
    iocs: {
      type: [IocMongooseSchema],
      required: true,
      default: []
    },

    mitreTechniques: {
      type: [MitreTechniqueMongooseSchema],
      required: true,
      default: []
    },

    suggestedActions: {
      type: [SuggestedActionMongooseSchema],
      required: true,
      default: []
    },
  },
  { timestamps: true }
);

const modelName = "Incident";

export const IncidentModel: Model<Incident & Document> = 
    (mongoose.models[modelName] as Model<Incident & Document>) || 
    mongoose.model<Incident & Document>(modelName, IncidentSchema);