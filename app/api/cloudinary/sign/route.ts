import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Default upload preset
const DEFAULT_UPLOAD_PRESET = "fueldev-compress";

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
    const { folder, public_id, upload_preset } = body;

    if (!folder || !public_id) {
      return NextResponse.json(
        { error: "Missing required parameters: folder and public_id" },
        { status: 400 },
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Use provided upload_preset or default
    const preset = upload_preset || DEFAULT_UPLOAD_PRESET;

    // Parameters to sign - MUST match exactly what's sent to Cloudinary
    // Include upload_preset in signed parameters (optional for signed uploads per Cloudinary docs)
    // These will be automatically sorted alphabetically by Cloudinary's api_sign_request
    const paramsToSign: Record<string, string | number> = {
      folder: folder,
      public_id: public_id,
      timestamp: timestamp,
      upload_preset: preset,
    };

    console.log("Signing params:", paramsToSign);

    // Generate signature for the upload parameters
    // Cloudinary's api_sign_request automatically handles alphabetical sorting
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );

    console.log("Generated signature:", signature);

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      public_id,
      upload_preset: preset,
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
