"use client";

import { useEffect, type RefObject } from "react";
import { getGsap, REDUCED_MOTION_QUERY } from "./gsap-setup";

export function useMagnetic(ref: RefObject<HTMLElement>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const { gsap } = getGsap();
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    function onMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    }

    function onLeave() {
      xTo(0);
      yTo(0);
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, strength]);
}
