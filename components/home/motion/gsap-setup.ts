// Shared GSAP setup for the experimental homepage — registers plugins once
// and exposes a consistent set of eases so every section shares the same
// "physics voice" instead of ad hoc easing per component.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function getGsap() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
    registered = true;
  }
  return { gsap, ScrollTrigger, Flip, SplitText };
}

export const EASE = {
  overshoot: "back.out(1.7)",
  elastic: "elastic.out(1, 0.55)",
  smooth: "expo.out",
  snap: "power4.out",
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";
