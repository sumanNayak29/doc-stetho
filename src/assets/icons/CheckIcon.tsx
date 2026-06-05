import type { SVGProps } from "react";

interface CheckIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const CheckIcon = ({ size = 10, ...props }: CheckIconProps) => (
    <svg
        width={size}
        height={Math.round(size * 0.7)}
        viewBox="0 0 10 7"
        fill="none"
        role="img"
        aria-label="Check"
        {...props}
    >
        <title>Check</title>
        <path d="M1 3.5L3.5 6L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default CheckIcon;
