import type { Media } from "./types";

export type UploadKind = "image" | "video";

/** Cloudinary's free tier rejects any single image over 10MB. */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
/** Long edge we downscale to. The site never renders an image wider than 1600. */
const MAX_EDGE = 2400;

/**
 * Shrinks a phone photo before it leaves the browser.
 *
 * Modern phone cameras produce 7–12MB JPEGs, which either bounce off the 10MB
 * limit outright or burn the account quota to deliver an 800px thumbnail. We
 * only ever serve <=1600px, so resampling to 2400px long-edge costs nothing
 * visible and cuts a typical upload by roughly 10x.
 *
 * Falls back to the original file whenever anything is off — an unreadable
 * image, a format the canvas cannot encode, an OOM on a huge bitmap — so this
 * can never be the reason an upload fails.
 */
async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    // Already small enough and under the cap: leave it untouched.
    if (scale === 1 && file.size <= MAX_IMAGE_BYTES) {
      bitmap.close();
      return file;
    }

    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.85),
    );
    if (!blob) return file;

    // Guard against the pathological case where re-encoding grows the file.
    if (blob.size >= file.size && file.size <= MAX_IMAGE_BYTES) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

/**
 * Browser -> Cloudinary direct upload. Never routed through our server, so the
 * ~4.5MB Vercel request-body limit doesn't apply to car videos.
 * XHR rather than fetch() purely because fetch has no upload progress events.
 */
export async function uploadToCloudinary(
  original: File,
  kind: UploadKind,
  onProgress?: (percent: number) => void,
): Promise<Media> {
  const file = kind === "image" ? await shrinkImage(original) : original;

  if (kind === "image" && file.size > MAX_IMAGE_BYTES) {
    throw new Error(
      `${original.name} is ${(file.size / 1048576).toFixed(1)}MB and could not be ` +
        `compressed below the 10MB limit. Export it at a smaller size and retry.`,
    );
  }

  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) {
    const { error } = await signRes.json().catch(() => ({}));
    throw new Error(error ?? "Could not authorise the upload. Try logging in again.");
  }
  const { timestamp, signature, apiKey, cloudName, folder } =
    await signRes.json();

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  return new Promise<Media>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/${kind}/upload`,
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        let msg = `Upload failed (${xhr.status})`;
        try {
          msg = JSON.parse(xhr.responseText).error?.message ?? msg;
        } catch {
          /* keep the status-code message */
        }
        return reject(new Error(msg));
      }
      const r = JSON.parse(xhr.responseText);
      resolve({ url: r.secure_url, publicId: r.public_id });
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.send(body);
  });
}
