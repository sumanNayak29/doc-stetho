import type { SVGProps } from "react";

interface SignOutIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const SignOutIcon = ({ size = 20, ...props }: SignOutIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Sign Out"
        {...props}
    >
        <title>Sign Out</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default SignOutIcon;
