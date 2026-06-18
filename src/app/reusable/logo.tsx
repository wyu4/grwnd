import { SVGType } from "@/types/global";
import { forwardRef } from "react";

/**
 * The official SVG version of the logo in component form
 */
const LogoComponent = forwardRef<SVGSVGElement, SVGType>(({ ...props }, ref) => {
  return (
    <svg ref={ref} width={250} height={250} viewBox="0 0 100 100" role="img" {...props}>
      <polygon
        points="0,0 0,100 100,100 100,0"
        fill="var(--font-primary)"
        stroke="var(--font-primary)"
      />
      <polyline
        points="75,25 25,25 25,75 75,75 75,50 50,50"
        fill="none"
        stroke="var(--primary)"
        strokeWidth={10}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
});

export default LogoComponent;
