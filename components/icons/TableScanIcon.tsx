import React from 'react';

export const TableScanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 10v4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4H3zM3 5c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v1H3V5z"></path>
    <path d="M3 19v-1h18v1c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1z"></path>
    <circle cx="12" cy="12" r="4"></circle>
    <path d="m15 15 1.5 1.5">
  </path>
</svg>
);