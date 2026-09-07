import { ORBIT } from "@/content/system";

/**
 * The camera model (docs/04 §2, docs/05 §4).
 * The orbital system is one SVG in "system units" (viewBox -1000 -1000 2000 2000,
 * origin at the core). Sections declare a camera keyframe with `data-camera`;
 * the system tweens between consecutive keyframes as each section scrolls in.
 */

export type CameraKey = "approach" | "flyby" | "in-motion" | "how-we-work" | "values" | "contact" | "page";

export type CameraState = {
  /** Camera centre in system units when not focused on a body. SVG axes: +y is down. */
  x: number;
  y: number;
  zoom: number;
  /** 0..1 blend from (x, y) toward the focused body's live position. */
  focusWeight: number;
  /** Offset of the camera centre from the focused body, as a fraction of viewport width/height.
   *  Positive fx puts the camera centre to the right of the body, so the body appears left. */
  fx: number;
  fy: number;
  /** Orbit stroke opacities. */
  lit: number;
  unlit: number;
  /** Core light scale and opacity (the core dims during a flyby so the panel stays legible). */
  core: number;
  coreOpacity: number;
  /** Body id being tracked. Not tweened. */
  focus: string | null;
};

export type Keyframe = Omit<CameraState, "focus">;

export const ZOOM_CAP = { desktop: 2.2, mobile: 1.6 } as const;
/** Narrow screens see the system a little wider so all orbits stay in view (docs/05 §9). */
const MOBILE_ZOOM = 0.8;
/** Body size on screen at zoom 1, and at the flyby peak (docs/04 §4.2). */
export const BODY_PX = { rest: 40, peakDesktop: 168, peakMobile: 112 } as const;
/** Where a flyby parks the body so the core light never sits behind the panel (docs/04 §4.2). */
export const FLYBY_ANGLE = { desktop: 270, mobile: 90 } as const;

/** Keyframe values from docs/04 §2, resolved for the current breakpoint. */
export function keyframe(key: CameraKey, mobile: boolean): Keyframe {
  const k = rawKeyframe(key, mobile);
  // Narrow screens: wider view, and the core pushed further from the copy (which flows taller).
  return key === "flyby" || !mobile ? k : { ...k, zoom: k.zoom * MOBILE_ZOOM, y: k.y * 1.5 };
}

function rawKeyframe(key: CameraKey, mobile: boolean): Keyframe {
  switch (key) {
    case "approach":
      // Desktop: copy sits left, the core to the right of it. Mobile: copy stacked, the core below the CTAs.
      return mobile
        ? { x: 0, y: -330, zoom: 1, focusWeight: 0, fx: 0, fy: 0, lit: 0.55, unlit: 0.1, core: 1, coreOpacity: 1 }
        : { x: -360, y: 0, zoom: 1, focusWeight: 0, fx: 0, fy: 0, lit: 0.55, unlit: 0.1, core: 1, coreOpacity: 1 };
    case "flyby":
      return mobile
        ? { x: 0, y: 0, zoom: ZOOM_CAP.mobile, focusWeight: 1, fx: 0, fy: 0.28, lit: 0.8, unlit: 0.06, core: 0.5, coreOpacity: 0.35 }
        : { x: 0, y: 0, zoom: ZOOM_CAP.desktop, focusWeight: 1, fx: 0.17, fy: 0, lit: 0.8, unlit: 0.06, core: 0.5, coreOpacity: 0.35 };
    case "in-motion":
      // Statement sits left; the system pulls back to the right of it.
      return mobile
        ? { x: 0, y: -200, zoom: 0.78, focusWeight: 0, fx: 0, fy: 0, lit: 0.4, unlit: 0.3, core: 1, coreOpacity: 1 }
        : { x: -200, y: 0, zoom: 0.78, focusWeight: 0, fx: 0, fy: 0, lit: 0.4, unlit: 0.3, core: 1, coreOpacity: 1 };
    case "how-we-work":
      return { x: 0, y: -300, zoom: 1.1, focusWeight: 0, fx: 0, fy: 0, lit: 0.3, unlit: 0.12, core: 1, coreOpacity: 1 };
    case "values":
      return { x: 100, y: -120, zoom: 1.6, focusWeight: 0, fx: 0, fy: 0, lit: 0.15, unlit: 0.05, core: 1.2, coreOpacity: 0.85 };
    case "contact":
      // Return complete: the Ring sits centred in the empty band under the CTA, never behind the copy.
      return mobile
        ? { x: 0, y: -20, zoom: 2.0, focusWeight: 0, fx: 0, fy: 0, lit: 0, unlit: 0, core: 0.65, coreOpacity: 0.9 }
        : { x: 0, y: -20, zoom: 2.0, focusWeight: 0, fx: 0, fy: 0, lit: 0, unlit: 0, core: 0.55, coreOpacity: 0.9 };
    case "page":
      // Static pages and reduced motion: the system sits low and calm behind long copy.
      return { x: 0, y: -380, zoom: 0.9, focusWeight: 0, fx: 0, fy: 0, lit: 0.4, unlit: 0.14, core: 1, coreOpacity: 0.7 };
  }
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** A point on orbit n at `angle` degrees, in system units, after the system tilt. */
export function bodyPosition(orbit: number, angle: number) {
  const r = ORBIT.radius(orbit);
  const px = r * Math.cos(toRad(angle));
  const py = r * ORBIT.ratio * Math.sin(toRad(angle));
  const t = toRad(ORBIT.tilt);
  return { x: px * Math.cos(t) - py * Math.sin(t), y: px * Math.sin(t) + py * Math.cos(t) };
}

/**
 * Live per-body state shared between the system layer (which renders it every
 * frame) and the flyby scenes (which tween it). Module singleton, client only.
 */
export type BodyState = {
  angle: number;
  scale: number;
  glow: number;
  /** Drifting along the orbit (the one perpetual motion). A flyby pauses it while pinned. */
  drift: boolean;
  /** Seconds per revolution. */
  period: number;
};
const bodyStates = new Map<string, BodyState>();

export function getBodyState(id: string, orbit = 1): BodyState {
  let s = bodyStates.get(id);
  if (!s) {
    s = { angle: ORBIT.restAngle(orbit), scale: 1, glow: 0.3, drift: true, period: 120 + (orbit - 1) * 60 };
    bodyStates.set(id, s);
  }
  return s;
}

/** Rest-state values a flyby returns a body to (docs/04 §4.2). */
export const BODY_REST = { scale: 1, glow: 0.3 } as const;

/** Shortest-path equivalent of `target` relative to `current` (degrees). */
export const nearestAngle = (current: number, target: number) => {
  const delta = ((((target - current) % 360) + 540) % 360) - 180;
  return current + delta;
};
/** Flyby peak: the rest-size body grows to its peak size on screen at the capped zoom (docs/04 §4.2). */
export const BODY_PEAK = {
  desktop: { scale: BODY_PX.peakDesktop / BODY_PX.rest / ZOOM_CAP.desktop, glow: 1 },
  mobile: { scale: BODY_PX.peakMobile / BODY_PX.rest / ZOOM_CAP.mobile, glow: 1 },
} as const;
