import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    originalSize: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
