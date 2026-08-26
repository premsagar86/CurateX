"use client";

import { useEffect, type RefObject } from "react";
import { getGsap, REDUCED_MOTION_QUERY } from "./gsap-setup";

// Pointer-tracked 3D tilt + a cursor-following CSS glow (--mx/--my custom
// properties consumed by the card's own radial-gradient background).
export function useTilt(ref: RefObject<HTMLElement>, maxTilt = 10) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const { gsap } = getGsap();
    el.style.transformStyle = "preserve-3d";
    const rotateX = gsap.quickTo(el, "rotateX", { duration: 0.4, ease: "power3.out" });
    const rotateY = gsap.quickTo(el, "rotateY", { duration: 0.4, ease: "power3.out" });
    const scale = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3.out" });

    function onMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotateY((px - 0.5) * maxTilt * 2);
      rotateX((0.5 - py) * maxTilt * 2);
      scale(1.02);
      el!.style.setProperty("--mx", `${px * 100}%`);
      el!.style.setProperty("--my", `${py * 100}%`);
    }

    function onLeave() {
      rotateX(0);
      rotateY(0);
      scale(1);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, maxTilt]);
}
