import React from 'react';

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M15.09 16.05a1.5 1.5 0 0 1-2.18 0"></path>
        <path d="M9 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 2-1.1 3.5-2 4.5a3 3 0 0 0-1 2.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.3a3 3 0 0 0-1-2.2c-.9-1-2-2.5-2-4.5Z"></path>
    </svg>
);