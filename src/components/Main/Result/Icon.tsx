export default function Icon({ type = "pending" }: { type?: Status }) {
  const icon = {
    succeeded: <path d="M10.833 16L14.6063 19.7733L22.1663 12.2267" />,
    failed: (
      <path d="M12.7266 19.7734L20.2732 12.2267M20.2732 19.7734L12.7266 12.2267" />
    ),
    ongoing: (
      <>
        <path d="M21.8283 16H21.8403" />
        <path d="M16.4943 16H16.5063" />
        <path d="M11.1593 16H11.1713" />
      </>
    ),
    pending: null,
  }[type];

  return (
    <svg
      width="33"
      height="32"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      <g
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: `var(--icon-stroke)` }}
      >
        <path
          d="M16.5003 29.3333C23.8337 29.3333 29.8337 23.3333 29.8337 16C29.8337 8.66667 23.8337 2.66667 16.5003 2.66667C9.16699 2.66667 3.16699 8.66667 3.16699 16C3.16699 23.3333 9.16699 29.3333 16.5003 29.3333Z"
          style={{ fill: `var(--icon-${type})`, transition: "fill 200ms" }}
        />
        {icon}
      </g>
    </svg>
  );
}
