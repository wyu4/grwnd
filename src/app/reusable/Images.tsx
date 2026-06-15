import { ImageType } from "@/types/global";
import { forwardRef } from "react";

/**
 * Image component that cannot be dragged, and is excluded from most indexing
 */
export const UndraggableImage = forwardRef<HTMLImageElement, ImageType>(
  ({ ...props }, fref) => {
    return <img ref={fref} aria-disabled={true} draggable={false} {...props} />;
  },
);
