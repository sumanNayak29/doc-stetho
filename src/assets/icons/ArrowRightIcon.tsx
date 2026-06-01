import type { SVGProps } from "react";

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" height={20} width={20} {...props}>
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
    );
};

export default ArrowRightIcon;
