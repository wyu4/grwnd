"use client";

import { AnchorType, ButtonType } from "@/types/global";
import { forwardRef } from "react";

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
