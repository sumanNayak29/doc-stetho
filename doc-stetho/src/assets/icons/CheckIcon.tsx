import type { SVGProps } from "react";

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg viewBox="0 0 10 7" fill="none" height={7} width={10} {...props}>
            <path d="M1 3.5L3.5 6L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default CheckIcon;
