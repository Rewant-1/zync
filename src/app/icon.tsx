import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#000"/>
        <text x="16" y="21" textAnchor="middle" fontFamily="system-ui, Arial, sans-serif" fontSize="18" fill="#fff" fontWeight="700">Z</text>
      </svg>
    ),
    size,
  );
}
