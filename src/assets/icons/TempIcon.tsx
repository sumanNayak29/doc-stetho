import type { SVGProps } from "react";

interface TempIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const TempIcon = ({ size = 14, ...props }: TempIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Temperature"
        {...props}
    >
        <title>Temperature</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
);

export default TempIcon;
