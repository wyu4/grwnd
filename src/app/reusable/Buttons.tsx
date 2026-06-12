import { ButtonType } from "@/types/global";
import { forwardRef } from "react";

const BlackButton = forwardRef<HTMLButtonElement, ButtonType>(
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

export default BlackButton;
