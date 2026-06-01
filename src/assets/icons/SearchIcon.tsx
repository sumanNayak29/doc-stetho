import type { SVGProps } from "react";

const SearchIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" height={16} width={16} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
};

export default SearchIcon;
