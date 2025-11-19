import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 3.34a10 10 0 1 1-14.995 9.12" />
      <path d="M7 10h1v4" />
      <path d="M8 10.5h1" />
      <path d="m10 10 3 4 3-4" />
    </svg>
  ),
};
