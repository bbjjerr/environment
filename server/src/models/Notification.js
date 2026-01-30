const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    payload: Schema.Types.Mixed,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = model("Notification", notificationSchema);
