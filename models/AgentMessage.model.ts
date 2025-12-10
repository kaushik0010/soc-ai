import mongoose, { Schema, model, models } from "mongoose";

const AgentMessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export const AgentMessage =
  models.AgentMessage || model("AgentMessage", AgentMessageSchema);
