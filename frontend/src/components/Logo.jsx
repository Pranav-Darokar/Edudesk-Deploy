import React from 'react';

const Logo = ({ className = "w-8 h-8", iconOnly = false }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
                        <feOffset dx="0.5" dy="0.5" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="6"
                    fill="url(#logo-gradient)"
                    filter="url(#shadow)"
                />
                <path
                    d="M12 6L4 10L12 14L20 10L12 6Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M4 10V14.5C4 14.5 7 16 12 16C17 16 20 14.5 20 14.5V10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 14V19"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 12.5V15.5C17 15.5 18 16 19 16C20 16 21 15.5 21 15.5V12.5"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {!iconOnly && (
                <span className="text-xl font-bold tracking-tight text-slate-900 ml-1">
                    EduDesk
                </span>
            )}
        </div>
    );
};

export default Logo;
