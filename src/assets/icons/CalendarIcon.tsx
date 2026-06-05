import type { SVGProps } from "react";

interface CalendarIconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

const CalendarIcon = ({ size = 20, ...props }: CalendarIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        role="img"
        aria-label="Calendar"
        {...props}
    >
        <title>Calendar</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default CalendarIcon;
