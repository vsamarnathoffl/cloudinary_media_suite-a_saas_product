import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import Video from "@/models/videoModel";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary credentials not found" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;
    const quality = formData.get("quality") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadOptions: any = {
          resource_type: "video",
          folder: "video-uploads",
        };

        if (quality === "medium") {
          uploadOptions.transformation = [
            {
              quality: "auto:eco",
              fetch_format: "mp4",
            },
          ];
        } else if (quality === "low") {
          uploadOptions.transformation = [
            {
              quality: "auto:low",
              fetch_format: "mp4",
            },
          ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );

        uploadStream.end(buffer);
      }
    );

    const video = await Video.create({
      title,
      description,
      publicId: result.public_id,
      originalSize,
      compressedSize: String(result.bytes),
      duration: result.duration || 0,
      userId,
      quality,
    });

    return NextResponse.json({ video }, { status: 200 });
  } catch (error) {
    console.error("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  }
}
