import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22 7L12 12"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2 7L12 12"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.5L7 9.5"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );

export const Spinner = (props: SVGProps<SVGSVGElement>) => (
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
