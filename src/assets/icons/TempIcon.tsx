import type { SVGProps } from "react";

const TempIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" height={14} width={14} {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
    );
};

export default TempIcon;
