import type { SVGProps } from "react";

interface SearchIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const SearchIcon = ({ size = 16, ...props }: SearchIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Search"
        {...props}
    >
        <title>Search</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default SearchIcon;
