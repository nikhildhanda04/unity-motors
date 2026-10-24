/**
 * 4:3 crop geometry, shared by the admin cropper and its test.
 * All rects are in source-image pixels.
 */

export const RATIO = 4 / 3;
export const MAX_ZOOM = 4;

export type Rect = { x: number; y: number; w: number; h: number };

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Largest 4:3 rect that fits inside the image — the zoom-1 starting frame. */
export function coverRect(natW: number, natH: number): Rect {
  const w = natW / natH > RATIO ? natH * RATIO : natW;
  const h = w / RATIO;
  return { x: (natW - w) / 2, y: (natH - h) / 2, w, h };
}

/** Moves the crop, keeping it wholly inside the image. */
export function pan(
  rect: Rect,
  nat: { w: number; h: number },
  dx: number,
  dy: number,
): Rect {
  return {
    ...rect,
    x: clamp(rect.x + dx, 0, nat.w - rect.w),
    y: clamp(rect.y + dy, 0, nat.h - rect.h),
  };
}

/** Rescales around the current centre. zoom 1 = the full cover rect. */
export function zoomTo(
  rect: Rect,
  nat: { w: number; h: number },
  zoom: number,
): Rect {
  const w = coverRect(nat.w, nat.h).w / clamp(zoom, 1, MAX_ZOOM);
  const h = w / RATIO;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  return {
    x: clamp(cx - w / 2, 0, nat.w - w),
    y: clamp(cy - h / 2, 0, nat.h - h),
    w,
    h,
  };
}

export const zoomOf = (rect: Rect, nat: { w: number; h: number }) =>
  coverRect(nat.w, nat.h).w / rect.w;
