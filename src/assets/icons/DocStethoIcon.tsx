import type { SVGProps } from "react";

const DocStethoIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        // <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" height={20} width={20} {...props}>
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full"  {...props}>
            <circle cx="60" cy="60" r="52" stroke="#4DBFBF" strokeWidth="4" strokeDasharray="12 6" opacity="0.4" />
            <circle cx="60" cy="60" r="42" stroke="#1A7A8A" strokeWidth="5" fill="none" />
            <circle cx="60" cy="60" r="30" fill="#EDF8FA" />
            <rect x="46" y="58" width="7" height="16" rx="1.5" fill="#1A7A8A" />
            <rect x="56" y="50" width="7" height="24" rx="1.5" fill="#1A7A8A" />
            <rect x="66" y="44" width="7" height="30" rx="1.5" fill="#4DBFBF" />
            <polyline points="44,68 54,56 64,50 76,38" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="70,38 76,38 76,44" stroke="#4DBFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="56" y="68" width="8" height="16" rx="1" fill="white" />
            <rect x="52" y="72" width="16" height="8" rx="1" fill="white" />
            <path d="M36 44 Q28 44 28 52 Q28 60 36 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="36" cy="62" r="3" fill="#4DBFBF" />
            <path d="M84 44 Q92 44 92 52 Q92 60 84 60" stroke="#1A7A8A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="84" cy="62" r="3" fill="#4DBFBF" />
        </svg>

    );
};

export default DocStethoIcon;
