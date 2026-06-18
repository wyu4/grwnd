"use client";

import { DivType } from "@/types/global";
import { useTimeline } from "@/utils/hooks/tween-hooks";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import { forwardRef, useRef } from "react";
import LogoComponent from "./logo";
import gsap from "gsap";

const ANIM_DUR = 0.6;

const LoadingScreen = forwardRef<
  HTMLDivElement,
  Omit<DivType, "children"> & { visible?: boolean }
>(({ className, hidden = false, ...props }, fref) => {
  const screen = useRef<HTMLDivElement>(null);
  const logo = useRef<SVGSVGElement>(null);
  const timeline = useTimeline();

  useGSAP(() => {
    const tl = timeline(true);
    if (!hidden && logo.current) {
      tl.set(logo.current, {
        rotation: 0,
        y: 0,
        transformOrigin: "50% 50%",
      }).to(
        logo.current,
        {
          rotation: "+=90",
          duration: ANIM_DUR,
          ease: "power2.in",
          repeat: -1,
          repeatRefresh: true,
          onUpdate() {
            if (!logo.current) return;
            const rotation = gsap.getProperty(logo.current, "rotation") as number; // Angle in degrees
            const theta = ((rotation % 90) * Math.PI) / 180; // Angle between 0 and PI/2 in radians
            const side = gsap.getProperty(logo.current, "width") as number; // Width of the square

            const diagonal = side / 2 / Math.sin(Math.PI / 4); // Calculate the diagonal of the square
            const h = diagonal * Math.sin(theta + Math.PI / 4); // Height of the center relative to ground

            const y = side / 2 - h; // Transformed height for the component
            gsap.set(logo.current, {
              y: y,
            });
          },
        },
        "<",
      );
    }

    return () => {
      console.log("Loading screen unmounted.");
      tl.kill();
    };
  }, [hidden]);
  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, fref, screen)}
      hidden={hidden}
      className={
        "loading-screen fixed z-102 w-full h-full top-0 left-0 bg-primary flex flex-col items-center justify-center " +
        className
      }
      {...props}
    >
      <LogoComponent
        ref={logo}
        width={undefined}
        height={undefined}
        className="w-15 aspect-square m-0"
      />
      <div className="bg-font-primary h-0.5 w-30" />
    </div>
  );
});

export default LoadingScreen;
