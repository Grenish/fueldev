import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testSignature() {
  console.log("\n🔐 Testing Cloudinary Signature Generation\n");
  console.log("=".repeat(60));

  // Check environment variables
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ CLOUDINARY_API_SECRET is not set");
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    console.error("❌ CLOUDINARY_API_KEY is not set");
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.error("❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
    process.exit(1);
  }

  console.log("✅ All environment variables are set\n");

  // Test parameters
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "fueldev/avatars/test-user-id";
  const public_id = "avatar";
  const upload_preset = "fueldev-compress";

  // Parameters to sign (will be alphabetically sorted by Cloudinary)
  const paramsToSign = {
    folder: folder,
    public_id: public_id,
    timestamp: timestamp,
    upload_preset: upload_preset,
  };

  console.log("📋 Parameters to sign:");
  console.log(JSON.stringify(paramsToSign, null, 2));
  console.log();

  // Generate signature using Cloudinary SDK
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  console.log("🔑 Generated Signature:", signature);
  console.log();

  // Build the string that Cloudinary will expect
  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
    .join("&");

  console.log("📝 String to sign (alphabetically sorted):");
  console.log(stringToSign);
  console.log();

  // Manual signature generation for verification
  const crypto = require("crypto");
  const manualSignature = crypto
    .createHash("sha1")
    .update(stringToSign + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  console.log("🔐 Manual SHA1 signature:", manualSignature);
  console.log();

  if (signature === manualSignature) {
    console.log("✅ Signatures match! The signature generation is correct.");
  } else {
    console.log("❌ Signatures don't match! There's an issue.");
  }

  console.log();
  console.log("=".repeat(60));
  console.log("\n📦 Form Data Parameters (in order for upload):");
  console.log("  1. file: [FILE OBJECT]");
  console.log(`  2. folder: ${folder}`);
  console.log(`  3. public_id: ${public_id}`);
  console.log(`  4. timestamp: ${timestamp}`);
  console.log(`  5. upload_preset: ${upload_preset}`);
  console.log(`  6. api_key: ${process.env.CLOUDINARY_API_KEY}`);
  console.log(`  7. signature: ${signature}`);
  console.log();
  console.log(
    "✅ upload_preset is OPTIONAL for signed uploads (per Cloudinary docs)",
  );
  console.log(
    "✅ When using upload_preset, include it in signature parameters",
  );
  console.log("⚠️  NOTE: Signature must be the last parameter!");
  console.log();

  // Test upload URL
  const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  console.log("🌐 Upload URL:", uploadUrl);
  console.log();

  console.log("=".repeat(60));
  console.log("\n✨ Test completed successfully!\n");
}

testSignature().catch((error) => {
  console.error("\n❌ Test failed:", error);
  process.exit(1);
});
