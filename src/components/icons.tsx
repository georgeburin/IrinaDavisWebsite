import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const ExpandIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

export const ShrinkIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);
