const { Schema, model } = require("mongoose");

const mediaAssetSchema = new Schema(
  {
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    type: { type: String, enum: ["image", "file", "link"], required: true },
    url: { type: String, required: true },
    size: Number,
    meta: Schema.Types.Mixed,
  },
  { timestamps: true },
);

module.exports = model("MediaAsset", mediaAssetSchema);
