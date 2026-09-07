export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <rect x="27" y="12" width="10" height="40" rx="3" fill="#E8F4F2" />
      <rect x="12" y="27" width="40" height="10" rx="3" fill="#E8F4F2" />
    </svg>
  )
}
