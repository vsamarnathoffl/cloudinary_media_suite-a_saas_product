import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbConfig/dbConfig";
import Image from "@/models/imageModel";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    console.log("images:"+images);
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
}
