import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
      required: true,
    },
    originalSize: {
      type: String,
      required: true,
    },
    compressedSize: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
