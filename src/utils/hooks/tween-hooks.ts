import gsap from "gsap";
import { useRef } from "react";

/**
 * Lazily create a GSAP timeline that persists for the lifetime of the component
 * @returns A getter that creates the timeline on first call and returns the same instance on every subsequent call
 */
export function useTimeline() {
  const ref = useRef<gsap.core.Timeline>(null);
  return (clear: boolean | void) => {
    if (!ref.current) {
      ref.current = gsap.timeline();
    }
    if (clear) {
      ref.current.clear();
    }
    return ref.current;
  };
}
