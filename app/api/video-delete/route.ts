import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbConfig/dbConfig";
import Video from "@/models/videoModel";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { publicId } = await request.json();
    console.log("Request Body:", { publicId });
    if (!publicId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await connect();

    const video = await Video.findOneAndDelete({ publicId });
    
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
