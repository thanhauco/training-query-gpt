import React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const StarIcon: React.FC<StarIconProps> = ({ filled = false, className, ...props }) => {
  if (filled) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        {...props}
      >
        <path d="M11.48 2.499a.75.75 0 0 1 1.04.342l2.077 4.21 4.647.675a.75.75 0 0 1 .416 1.28l-3.362 3.277.794 4.624a.75.75 0 0 1-1.088.791L12 15.934l-4.004 2.112a.75.75 0 0 1-1.088-.79l.794-4.625-3.362-3.277a.75.75 0 0 1 .416-1.28l4.647-.675 2.077-4.21a.75.75 0 0 1 .998-.342Z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3.75 14.31 8.4l4.94.72-3.625 3.53.856 5-4.481-2.356L7.52 17.65l.855-5L4.75 9.12l4.94-.72L12 3.75Z" />
    </svg>
  );
};
