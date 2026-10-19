/**
 * Cloudinary delivery-URL helpers. Deliberately free of the cloudinary SDK so
 * client components can import them without dragging a Node-only package
 * (and its fs/path deps) into the browser bundle.
 */

/** Inserts Cloudinary transforms into a delivery URL. */
export function tx(url: string, transform: string) {
  return url.replace("/upload/", `/upload/${transform}/`);
}

/** Resized, auto-format, auto-quality image. Cloudinary does the work, not Next. */
export const img = (url: string, width: number) =>
  tx(url, `w_${width},c_limit,f_auto,q_auto`);

/** First frame of a video as a poster image, so <video> can stay preload="none". */
export const videoPoster = (url: string) =>
  tx(url, "w_1200,c_limit,f_auto,q_auto").replace(
    /\.(mp4|mov|webm|m4v)$/i,
    ".jpg",
  );
