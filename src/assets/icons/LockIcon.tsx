import type { SVGProps } from "react";

interface LockIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const LockIcon = ({ size = 20, ...props }: LockIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Lock"
        {...props}
    >
        <title>Lock</title>
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export default LockIcon;
