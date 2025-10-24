import React from 'react';

export const SortIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M3 6h6"></path>
    <path d="M3 12h8"></path>
    <path d="M3 18h10"></path>
    <path d="m18 15 3 3 3-3"></path>
    <path d="M21 6v12"></path>
  </svg>
);