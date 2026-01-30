const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
    name: { type: String },
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    pinnedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });

module.exports = model("Conversation", conversationSchema);
