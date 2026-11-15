import type { SVGProps } from "react";

const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  map: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z M9 3v15 M15 6v15",
  sprout: "M12 22V12m0 4C8 16 4 13 4 8c5 0 8 3 8 7m0-2c0-6 3-9 9-9 0 6-3 9-9 9",
  clipboard: "M8 5H5v16h14V5h-3 M9 3h6l1 4H8l1-4Z M8 12h8 M8 16h8",
  history: "M3 12a9 9 0 1 1 3 7m-3-7V6m0 6h6m3-5v5l3 2",
  chart: "M3 20h18 M5 17v-4h3v4 M11 17V9h3v8 M17 17V5h3v12",
  settings: "M10 3h4l.5 2.8 2 .9 2.4-1.5 2.8 2.8-1.5 2.4.9 2 2.9.6v4l-2.9.5-.9 2-2.4-1.5-2.8 2.8-2.3-1.5-.7 2.7h-4l-.5-2.8-2-.9-2.4 1.5-2.8-2.8 1.5-2.4-.9-2L1 13v-4l2.9-.5.9-2L3.3 4.1l2.8-2.8 2.4 1.5L10 3Z",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M9.2 9a3 3 0 1 1 4.8 2.4c-1.5 1-2 1.5-2 2.6 M12 17h.01",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  pin: "M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  calendar: "M4 5h16v16H4z M4 10h16 M8 3v4 M16 3v4 M8 14h2 M14 14h2 M8 17h2",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 12h.01",
  basket: "M3 10h18l-2 10H5L3 10Z M7 10l5-7 5 7 M9 14v3 M15 14v3",
  checklist: "M9 3h6v4H9z M9 5H5v16h14V5h-4 M8 14l2 2 5-5",
  check: "m5 12 4 4L19 6",
  left: "M19 12H5m7 7-7-7 7-7",
  right: "M5 12h14m-7-7 7 7-7 7",
  upRight: "M6 18 18 6M9 6h9v9",
  search: "M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.5-2 5 5",
  plus: "M5 12h14M12 5v14",
  minus: "M5 12h14",
  close: "m6 6 12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 11v5m0-8h.01",
  home: "m3 10 9-7 9 7v10H3Z M9 20v-7h6v7",
  coins: "M17 9c0 2-3 3.5-7 3.5S3 11 3 9s3-4 7-4 7 2 7 4Z M3 9v5c0 2 3 4 7 4 M17 9v2 M13 14c0 1.7 2 3 4.5 3s4.5-1.3 4.5-3-2-3-4.5-3-4.5 1.3-4.5 3Zm0 0v4c0 1.7 2 3 4.5 3s4.5-1.3 4.5-3v-4",
  leaf: "M20 4C9 4 4 8 4 14a6 6 0 0 0 6 6c6 0 10-5 10-16ZM4 20l9-9",
  drop: "M12 2c5 6 7 9 7 13a7 7 0 0 1-14 0c0-4 2-7 7-13Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  lock: "M5 10h14v11H5z M8 10V7a4 4 0 1 1 8 0v3 M12 14v3",
  cloud: "M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5-1 4.5 4.5 0 1 1 .5 9Z",
  wind: "M3 8h12a2 2 0 1 0-2-2 M3 12h16a2 2 0 1 1-2 2 M3 16h8a2 2 0 1 1-2 2",
  expand: "M14 4h6v6m0-6-6 6M4 14v6h6m-6 0 6-6",
  locate: "m3 11 18-8-8 18-2-8-8-2Z",
  filter: "M4 7h16M7 12h10m-7 5h4",
  menu: "M4 6h16M4 12h16M4 18h16",
  more: "M12 5h.01M12 12h.01M12 19h.01",
  logout: "M9 4H4v16h5 M10 12h10m-4-4 4 4-4 4",
  layers: "m12 3 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 16l9 5 9-5",
  edit: "m4 16 11-11 4 4L8 20H4v-4ZM13 7l4 4",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {name === "settings" ? <><path d="m10 3-.7 2.4-2 .9L5 5.2 3 7.4l1.2 2.2-.5 2.1L2 13v2l2.4.8 1 1.7-.5 2.6 2.6 1 1.8-1.7 2 .1L13 22l2.7-.6.8-2.4 1.8-1 2.4.5 1.3-2.3-1.5-2v-2l1.5-1.8-1.2-2.5-2.5.3-1.8-1-.6-2.4L13 4l-1 1.5-2-.1V3Z" /><circle cx="12" cy="12.5" r="3" /></> : <path d={paths[name]} />}
    </svg>
  );
}

