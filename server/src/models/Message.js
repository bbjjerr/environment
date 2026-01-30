const { Schema, model } = require("mongoose");

const richContentSchema = new Schema(
  {
    type: { type: String, enum: ["image", "file", "link"] },
    url: String,
    meta: Schema.Types.Mixed,
  },
  { _id: false },
);

const reactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    emoji: String,
  },
  { _id: false },
);

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, trim: true },
    attachments: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
    richContent: richContentSchema,
    reactions: [reactionSchema],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = model("Message", messageSchema);
