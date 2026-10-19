import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const UPLOAD_FOLDER = "unity-motors/cars";

/**
 * Signs a direct browser->Cloudinary upload. The browser never sees the API
 * secret, and only a logged-in admin can get a signature (see the route).
 */
export function signUpload(timestamp: number) {
  return cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    process.env.CLOUDINARY_API_SECRET!,
  );
}

/**
 * Deletes assets when a car is removed, so storage doesn't leak.
 * Never throws: a failed cleanup must not block the car from being deleted.
 */
export async function destroyAssets(
  assets: { publicId: string; kind: "image" | "video" }[],
) {
  await Promise.all(
    assets.map(({ publicId, kind }) =>
      cloudinary.uploader
        .destroy(publicId, { resource_type: kind, invalidate: true })
        .catch((err) =>
          console.error(`[cloudinary] failed to destroy ${publicId}`, err),
        ),
    ),
  );
}
