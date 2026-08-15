import { cn } from "@/lib/utils";

/**
 * Cortex AI brand mark — a stylized neural cortex: a central node connected
 * to four orbiting nodes via synapses. Uses currentColor so it adapts to any
 * text color / theme.
 */
export function CortexMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 148 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      <circle cx="74" cy="50" r="20" fill="currentColor" />
      <circle cx="30" cy="30" r="8" fill="currentColor" />
      <circle cx="118" cy="30" r="8" fill="currentColor" />
      <circle cx="30" cy="70" r="8" fill="currentColor" />
      <circle cx="118" cy="70" r="8" fill="currentColor" />
      <path
        d="M30 30 L74 50 L118 30 M30 70 L74 50 L118 70"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
