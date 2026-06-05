import type { SVGProps } from "react";

interface BoltIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const BoltIcon = ({ size = 14, ...props }: BoltIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Bolt"
        {...props}
    >
        <title>Bolt</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default BoltIcon;
