"use client";

import { AnchorType, ButtonType } from "@/types/global";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, ReactNode, RefObject, useRef, useState } from "react";

export const BlackButton = forwardRef<HTMLButtonElement, ButtonType>(
  ({ className, children, ...props }, fref) => {
    return (
      <button
        ref={fref}
        className={`bg-font-primary mt-1 text-primary rounded-full text-center px-4 py-1 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export const PushLink = forwardRef<HTMLAnchorElement, AnchorType>(
  ({ className, children, ...props }, fref) => {
    return (
      <a
        ref={fref}
        className={`bg-tertiary aspect-square text-font-primary border border-font-tertiary rounded text-center p-3 flex flex-col justify-center items-center ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  },
);

export const PushButton = forwardRef<HTMLButtonElement, ButtonType>(
  ({ className, children, ...props }, fref) => {
    return (
      <button
        ref={fref}
        className={`bg-tertiary aspect-square text-font-primary border border-font-tertiary rounded text-center p-3 flex flex-col justify-center items-center ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export function TabButton({
  href,
  name,
  children,
  isButton = false,
  className = "",
  onClick,
}: {
  name?: string;
  href: string | null;
  children: ReactNode;
  isButton?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hovering, setHovering] = useState(false);

  useGSAP(() => {
    if (ref.current === null) return;
    gsap.set(ref.current, {
      color: hovering ? "var(--font-secondary)" : "var(--font-primary)",
    });
  }, [hovering]);

  return (
    <>
      {isButton ? (
        <button
          ref={ref as RefObject<HTMLButtonElement>}
          className={
            "flex flex-col justify-center items-center text-3xl gap-0.5 text-font-primary " +
            className
          }
          onClick={onClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {children}
          {name && <p className="text-sm">{name}</p>}
        </button>
      ) : (
        <a
          ref={ref as RefObject<HTMLAnchorElement>}
          className={
            "flex flex-col justify-center items-center text-3xl gap-0.5 text-font-primary " +
            className
          }
          href={href ?? undefined}
          onClick={onClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {children}
          {name && <p className="text-sm">{name}</p>}
        </a>
      )}
    </>
  );
}
