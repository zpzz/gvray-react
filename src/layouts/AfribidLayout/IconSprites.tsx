import React from 'react';

/** 原型 SVG sprite，供 <svg className="icon"><use href="#arrow" /></svg> 使用 */
const IconSprites: React.FC = () => (
  <svg className="icon-library" aria-hidden="true" focusable="false">
    <symbol id="arrow" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </symbol>
    <symbol id="search" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </symbol>
    <symbol id="heart" viewBox="0 0 24 24">
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
    </symbol>
    <symbol id="pin" viewBox="0 0 24 24">
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </symbol>
    <symbol id="clock" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </symbol>
    <symbol id="check" viewBox="0 0 24 24">
      <path d="M5 12l5 5L20 7" />
    </symbol>
    <symbol id="user" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 14.5-4 16 0" />
    </symbol>
    <symbol id="bell" viewBox="0 0 24 24">
      <path d="M6 16h12l-1.2-2.2a6.5 6.5 0 01-.8-3.3V9a5 5 0 00-10 0v1.5c0 1.2-.3 2.3-.8 3.3L6 16z" />
      <path d="M10 18a2 2 0 004 0" />
    </symbol>
    <symbol id="shield" viewBox="0 0 24 24">
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </symbol>
    <symbol id="wallet" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16" cy="14" r="1" />
    </symbol>
    <symbol id="gavel" viewBox="0 0 24 24">
      <path d="M14 4l6 6M8 10l6 6M3 21h8M11 7l-6 6" />
    </symbol>
    <symbol id="doc" viewBox="0 0 24 24">
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </symbol>
    <symbol id="info" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </symbol>
    <symbol id="close" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" />
    </symbol>
    <symbol id="download" viewBox="0 0 24 24">
      <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
    </symbol>
    <symbol id="play" viewBox="0 0 24 24">
      <path d="M8 5l12 7-12 7z" />
    </symbol>
    <symbol id="pause" viewBox="0 0 24 24">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
    </symbol>
    <symbol id="car" viewBox="0 0 24 24">
      <path d="M4 14l2-5h12l2 5M5 14h14v4H5z" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </symbol>
  </svg>
);

export default IconSprites;

export function Icon({
  name,
  className = 'icon',
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}
