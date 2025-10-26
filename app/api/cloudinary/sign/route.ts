import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary environment variables");
      return NextResponse.json(
        { error: "Cloudinary is not properly configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { folder, public_id } = body;

    if (!folder || !public_id) {
      return NextResponse.json(
        { error: "Missing required parameters: folder and public_id" },
        { status: 400 },
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Parameters to sign - must match exactly what's sent to Cloudinary
    const paramsToSign = {
      folder: folder,
      public_id: public_id,
      timestamp: timestamp,
      upload_preset: "ml_default",
    };

    console.log("Signing params:", { ...paramsToSign, folder: "***" });

    // Generate signature for the upload parameters
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Error signing Cloudinary params:", error);
    return NextResponse.json(
      {
        error: "Failed to sign upload parameters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
