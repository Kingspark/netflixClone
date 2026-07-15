export default function Icon({ name, className = '', filled = false }) {
  const icons = {
    search: (
      <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    bell: (
      <path d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.42V11a6 6 0 10-12 0v3.18c0 .53-.21 1.04-.59 1.42L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    ),
    profile: (
      <>
        <path d="M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
        <path d="M5.5 19a6.5 6.5 0 0113 0" />
      </>
    ),
    chevronDown: <path d="M6 9l6 6 6-6" />,
    chevronLeft: <path d="M15 5l-7 7 7 7" />,
    chevronRight: <path d="M9 5l7 7-7 7" />,
    play: <path d="M8 6l10 6-10 6V6z" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v6" />
        <path d="M12 7.5h.01" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    check: <path d="M7 12.5l3.2 3.2L17 8.9" />,
    heart: (
      <path d="M12 20.5s-7.5-4.6-10-9.4C.4 7.6 2.3 4 5.9 4c2 0 3.5 1 6.1 3.6C14.6 5 16.1 4 18.1 4c3.6 0 5.5 3.6 3.9 7.1-2.5 4.8-10 9.4-10 9.4z" />
    ),
    facebook: <path d="M13 9h3V5h-3c-2.2 0-4 1.8-4 4v3H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 011-1z" />,
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    twitter: <path d="M21 7.2c-.67.3-1.39.5-2.15.58a3.76 3.76 0 001.65-2.08 7.56 7.56 0 01-2.38.91 3.77 3.77 0 00-6.42 3.43A10.7 10.7 0 013 6.78a3.77 3.77 0 001.17 5.03 3.72 3.72 0 01-1.7-.47v.05a3.78 3.78 0 003.02 3.7 3.82 3.82 0 01-1.7.07 3.78 3.78 0 003.52 2.62A7.56 7.56 0 012 19.54a10.66 10.66 0 005.78 1.69c6.94 0 10.73-5.75 10.73-10.73v-.49A7.53 7.53 0 0021 7.2z" />,
    close: (
      <>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </>
    ),
    menu: (
      <>
        <path d="M3 12h18" />
        <path d="M3 6h18" />
        <path d="M3 18h18" />
      </>
    ),
    youtube: (
      <>
        <path d="M21.6 8.2a2.98 2.98 0 00-2.1-2.1C17.65 5.6 12 5.6 12 5.6s-5.65 0-7.5.5A2.98 2.98 0 002.4 8.2 31.2 31.2 0 002 12a31.2 31.2 0 00.4 3.8 2.98 2.98 0 002.1 2.1c1.85.5 7.5.5 7.5.5s5.65 0 7.5-.5a2.98 2.98 0 002.1-2.1A31.2 31.2 0 0022 12a31.2 31.2 0 00-.4-3.8z" />
        <path d="M10 15.5l5.2-3.5L10 8.5v7z" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}