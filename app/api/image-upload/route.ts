import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Image from "@/models/imageModel";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const option = formData.get("option") as string;
    console.log(option);
    if (option === "DOWNLOAD") {
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "next-cloudinary-uploads" },
            (error: any, result: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as CloudinaryUploadResult);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );
      return NextResponse.json(
        {
          publicId: result.public_id,
        },
        {
          status: 200,
        }
      );
    } else if (option === "UPLOADTOMONGO") {
      try {
        const publicId = formData.get("publicId");
        const originalSize = formData.get("originalSize");
        const title = formData.get("title");
        const image = await Image.create({
          publicId,
          originalSize,
          userId,
          title
        });
        return NextResponse.json(
          {
            image,
          },
          {
            status: 200,
          }
        );
      } catch (error) {
        return NextResponse.json(
          { error: "Upload image failed to DB" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }
  } catch (error) {
    console.log("UPload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
