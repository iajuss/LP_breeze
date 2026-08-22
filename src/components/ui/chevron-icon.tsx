type ChevronIconProps = {
  direction?: "down" | "right" | "up";
  className?: string;
};

const rotationClass = {
  down: "rotate-0",
  right: "-rotate-90",
  up: "rotate-180",
} as const;

export function ChevronIcon({ direction = "down", className = "" }: ChevronIconProps) {
  return (
    <svg aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform ${rotationClass[direction]} ${className}`} data-testid="arcora-chevron" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
