import type { SVGProps } from "react";

interface CheckCircleIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const CheckCircleIcon = ({ size = 20, ...props }: CheckCircleIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Check Circle"
        {...props}
    >
        <title>Check Circle</title>
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default CheckCircleIcon;
