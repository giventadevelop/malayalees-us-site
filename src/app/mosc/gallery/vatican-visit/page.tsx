import React from 'react';
import { Metadata } from 'next';
import GalleryAlbum from '../components/GalleryAlbum';

export const metadata: Metadata = {
  title: 'Vatican Visit of His Holiness | Gallery | MOSC',
  description: 'Photo gallery of Vatican Visit of His Holiness.',
};

export default function VaticanVisitPage() {
  const photos = [
    { src: '/images/mosc/gallery/vatican-visit/IMG_1262.jpg', alt: 'Vatican Visit of His Holiness Baselios Marthoma Paulose II, September 5, 2013' },
    { src: '/images/mosc/gallery/vatican-visit/IMG_1258.jpg', alt: 'Vatican Visit of His Holiness Baselios Marthoma Paulose II, September 5, 2013' },
    { src: '/images/mosc/gallery/vatican-visit/IMG_1232.jpg', alt: 'Vatican Visit of His Holiness Baselios Marthoma Paulose II, September 5, 2013' },
    { src: '/images/mosc/gallery/vatican-visit/IMG_1266.jpg', alt: 'Vatican Visit of His Holiness Baselios Marthoma Paulose II, September 5, 2013' },
    { src: '/images/mosc/gallery/vatican-visit/IMG_1234.jpg', alt: 'Vatican Visit of His Holiness Baselios Marthoma Paulose II, September 5, 2013' },
  ];

  return (
    <GalleryAlbum
      title="Vatican Visit of His Holiness Baselios Marthoma Paulose II"
      date="September 5, 2013"
      category="Ecumenical Visits"
      photos={photos}
    />
  );
}
