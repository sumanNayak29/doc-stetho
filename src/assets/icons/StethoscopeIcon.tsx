import type { SVGProps } from "react";

interface StethoscopeIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const StethoscopeIcon = ({ size = 40, ...props }: StethoscopeIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="10 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Stethoscope"
        {...props}
    >
        <title>Stethoscope</title>
        {/* Ear Tips */}
        <rect x="14" y="6" width="5" height="5" rx="2.5" fill="#8BB2C2" />
        <rect x="29" y="6" width="5" height="5" rx="2.5" fill="#8BB2C2" />

        {/* Metallic Tubes (Grey) */}
        <path
            d="M 16.5 9.5 C 12 16.5, 15.5 24, 18.5 25.5"
            stroke="#D1D5DB"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />
        <path
            d="M 31.5 9.5 C 36 16.5, 32.5 24, 29.5 25.5"
            stroke="#D1D5DB"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
        />

        {/* U-Shaped Tube (Teal-Teal) */}
        <path
            d="M 18 25 C 18 33, 30 33, 30 25"
            stroke="#52B2C9"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
        />

        {/* Connecting Tube to Chestpiece (Teal-Blue) */}
        <path
            d="M 24 31.5 C 24 39.5, 37 39.5, 37 31"
            stroke="#259BCA"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
        />

        {/* Chestpiece Stem/Connector */}
        <rect x="35.5" y="29.5" width="3" height="3.5" rx="1" fill="#64748B" />

        {/* Chestpiece (Double Circle) */}
        <circle cx="37" cy="24" r="6.5" fill="#7E8E9F" />
        <circle cx="37" cy="24" r="4" fill="#A1B0BF" />
    </svg>
);

export default StethoscopeIcon;
