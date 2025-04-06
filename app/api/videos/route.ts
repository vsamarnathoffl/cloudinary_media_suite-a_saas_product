import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connect from "@/dbConfig/dbConfig";
import Video from "@/models/videoModel";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 }
    );
  }
}
