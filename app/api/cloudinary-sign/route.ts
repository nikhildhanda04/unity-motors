import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { signUpload, UPLOAD_FOLDER } from "@/lib/cloudinary";

// node runtime: the cloudinary SDK and node:crypto aren't edge-safe.
export const runtime = "nodejs";

/**
 * Hands a logged-in admin a short-lived signature so the browser can upload
 * straight to Cloudinary. This exists because Vercel caps serverless request
 * bodies at ~4.5MB — a car video can never be POSTed through a route handler.
 *
 * Signed (not unsigned) uploads mean knowing the cloud name isn't enough to
 * dump files into the account.
 */
export async function POST() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Set the CLOUDINARY_* env vars." },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  return NextResponse.json({
    timestamp,
    signature: signUpload(timestamp),
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    folder: UPLOAD_FOLDER,
  });
}
