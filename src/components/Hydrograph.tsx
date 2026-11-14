/** The brand's single decorative device: a river-level curve (quick rise, slow recession). */
export function Hydrograph() {
  return (
    <svg
      className="hydrograph"
      viewBox="0 0 600 28"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 24 C80 24 120 23 170 22 C210 21 230 3 260 3 C300 3 320 20 400 23 C480 25 540 24 600 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
