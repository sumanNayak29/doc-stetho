import type { SVGProps } from "react";

interface ArrowRightIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const ArrowRightIcon = ({ size = 20, ...props }: ArrowRightIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        role="img"
        aria-label="Arrow Right"
        {...props}
    >
        <title>Arrow Right</title>
        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

export default ArrowRightIcon;
