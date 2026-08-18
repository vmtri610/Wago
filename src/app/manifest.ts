import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '和語ノート — Sổ tay từ vựng',
    short_name: 'Wago Note',
    description: 'Sổ tay học từ vựng tiếng Nhật',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F6F0',
    theme_color: '#2B4570',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
