import type { SVGProps } from "react";

interface UsersGroupIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const UsersGroupIcon = ({ size = 24, ...props }: UsersGroupIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        role="img"
        aria-label="Users Group"
        {...props}
    >
        <title>Users Group</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export default UsersGroupIcon;
