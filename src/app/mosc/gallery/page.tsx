import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery | Malankara Orthodox Syrian Church',
  description: 'Photo gallery of significant events, ecumenical visits, and ceremonies of the Malankara Orthodox Syrian Church.',
  keywords: ['MOSC Gallery', 'Photo Gallery', 'Church Events', 'Ecumenical Visits', 'Orthodox Church'],
};

export default function GalleryPage() {
  const albums = [
    {
      id: 'enthronement-mathews-iii',
      title: 'Enthronement Ceremony of His Holiness Baselios Marthoma Mathews III',
      date: '2021',
      photoCount: 25,
      category: 'Major Events',
      imageUrl: '/images/gallery/enthronement.jpg',
    },
    {
      id: 'russia-visit',
      title: 'Russia Visit of H.H Baselios Marthoma Mathews III',
      date: '2019',
      photoCount: 30,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/russia-visit.jpg',
    },
    {
      id: 'ceremonial-reception-russian-orthodox',
      title: 'Ceremonial Reception given to H.H The Catholicos of India by the Russian Orthodox Church',
      date: '2019',
      photoCount: 15,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/ceremonial-reception.jpg',
    },
    {
      id: 'ethiopian-visit',
      title: 'Ethiopian Visit of His Holiness',
      date: 'February 28, 2013',
      photoCount: 20,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/ethiopian-visit.jpg',
    },
    {
      id: 'vatican-visit',
      title: 'Vatican Visit of His Holiness',
      date: '2016',
      photoCount: 18,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit.jpg',
    },
    {
      id: 'visit-abune-mathias',
      title: 'Visit of His Holiness Abune Mathias Patriarch Ethiopian Orthodox Tewahedo Church',
      date: '2016',
      photoCount: 12,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/ethiopian-patriarch.jpg',
    },
    {
      id: 'order-st-thomas-abune-mathias',
      title: 'Order of St.Thomas to His Holiness Abune Mathias Patriarch Ethiopian Orthodox Tewahedo Church',
      date: '2016',
      photoCount: 10,
      category: 'Major Events',
      imageUrl: '/images/gallery/order-st-thomas.jpg',
    },
    {
      id: 'armenian-genocide-100th',
      title: '100th Anniversary of the Armenian Genocide',
      date: 'July 18, 2015',
      photoCount: 22,
      category: 'Special Events',
      imageUrl: '/images/gallery/armenian-genocide-100th.jpg',
    },
    {
      id: 'armenian-genocide-canonization',
      title: 'Service of Canonization of the Victims of Armenian Genocide',
      date: 'April 23, 2015',
      photoCount: 18,
      category: 'Special Events',
      imageUrl: '/images/gallery/armenian-canonization.jpg',
    },
    {
      id: 'private-audience-aram',
      title: 'Private Audience with H.H Aram - 100th Anniversary of the Armenian Genocide',
      date: 'July 17, 2015',
      photoCount: 8,
      category: 'Private Audiences',
      imageUrl: '/images/gallery/armenian-private-audience.jpg',
    },
    {
      id: 'private-audience-karekin',
      title: 'Private Audience with Karekin I, Supreme Patriarch and Catholicos of All Armenians',
      date: '2015',
      photoCount: 10,
      category: 'Private Audiences',
      imageUrl: '/images/gallery/karekin-audience.jpg',
    },
    {
      id: 'armenian-president',
      title: 'His Holiness with Armenian President',
      date: 'April 23, 2015',
      photoCount: 6,
      category: 'Special Events',
      imageUrl: '/images/gallery/armenian-president.jpg',
    },
    {
      id: 'blessing-holy-myron',
      title: 'Blessing of Holy Myron',
      date: 'July 19, 2015, Beirut',
      photoCount: 15,
      category: 'Liturgical Events',
      imageUrl: '/images/gallery/holy-myron.jpg',
    },
    {
      id: 'enthronement-coptic-pope',
      title: 'Enthronement Ceremony of the New Coptic Pope',
      date: '2012',
      photoCount: 20,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/coptic-pope.jpg',
    },
    {
      id: 'paulose-ii-with-kiril',
      title: 'H.H Baselios Marthoma Paulose II with Kiril Patriarch',
      date: '2012',
      photoCount: 8,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/kiril-patriarch.jpg',
    },
    {
      id: 'rome-visit',
      title: 'Rome',
      date: '2015',
      photoCount: 14,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/rome-visit.jpg',
    },
    {
      id: 'canberra-visit',
      title: 'H.H Visit to Canberra',
      date: 'November 17, 2015',
      photoCount: 12,
      category: 'Church Visits',
      imageUrl: '/images/gallery/canberra-visit.jpg',
    },
    {
      id: 'reception-tikon-puthupally',
      title: 'Reception to H.B.Tikon at Puthupally Church',
      date: '2015',
      photoCount: 10,
      category: 'Receptions',
      imageUrl: '/images/gallery/puthupally-reception.jpg',
    },
    {
      id: 'private-audience-tikon-devalokam',
      title: 'Private Audience with H.B.Tikon at Devalokam Aramana',
      date: 'November 25, 2015',
      photoCount: 8,
      category: 'Private Audiences',
      imageUrl: '/images/gallery/tikon-audience.jpg',
    },
    {
      id: 'reception-mathews-iii',
      title: 'Reception to His Holiness Baselios Marthoma Mathews III',
      date: '2021',
      photoCount: 16,
      category: 'Receptions',
      imageUrl: '/images/gallery/mathews-reception.jpg',
    },
    {
      id: 'offering-incense-st-thomas',
      title: 'Offering Incense at the Relics of St.Thomas (Devalokam Aramana)',
      date: '2016',
      photoCount: 6,
      category: 'Liturgical Events',
      imageUrl: '/images/gallery/st-thomas-relics.jpg',
    },
    {
      id: 'website-inauguration',
      title: 'Official Website Inauguration, Devalokam Aramana',
      date: 'November 25, 2015',
      photoCount: 10,
      category: 'Special Events',
      imageUrl: '/images/gallery/website-inauguration.jpg',
    },
    {
      id: 'pokrovsky-monastery',
      title: 'The Great Shepherd of Malankara Prayerfully in Pokrovsky Monastery Chapel',
      date: '2019',
      photoCount: 8,
      category: 'Liturgical Events',
      imageUrl: '/images/gallery/pokrovsky-monastery.jpg',
    },
    {
      id: 'vienna-fraternity',
      title: 'The Fraternity at Vienna',
      date: 'September 3, 2013',
      photoCount: 12,
      category: 'Special Events',
      imageUrl: '/images/gallery/vienna-fraternity.jpg',
    },
    {
      id: 'st-cyril-methodius',
      title: 'Official Reception at the Main Chapel of St. Cyril and Methodius Institute',
      date: '2019',
      photoCount: 10,
      category: 'Receptions',
      imageUrl: '/images/gallery/cyril-methodius.jpg',
    },
    {
      id: 'mother-feofania',
      title: 'Mother Feofania and the Little Flowers of the Convent',
      date: '2019',
      photoCount: 8,
      category: 'Special Events',
      imageUrl: '/images/gallery/mother-feofania.jpg',
    },
    {
      id: 'dharma-dhamma-conference',
      title: '3rd International Dharma-Dhamma Conference',
      date: 'October 24-26, 2015, Indore',
      photoCount: 14,
      category: 'Conferences',
      imageUrl: '/images/gallery/dharma-conference.jpg',
    },
    {
      id: 'vatican-visit-1',
      title: 'Visit of H.H The Catholicos to the Vatican',
      date: '2013',
      photoCount: 10,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit-1.jpg',
    },
    {
      id: 'vatican-visit-2',
      title: 'Visit of H.H The Catholicos to the Vatican',
      date: '2013',
      photoCount: 10,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit-2.jpg',
    },
    {
      id: 'vatican-visit-3',
      title: 'Visit of H.H The Catholicos to the Vatican',
      date: '2013',
      photoCount: 10,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit-3.jpg',
    },
    {
      id: 'vatican-visit-4',
      title: 'Visit of H.H The Catholicos to the Vatican',
      date: '2013',
      photoCount: 10,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit-4.jpg',
    },
    {
      id: 'vatican-visit-5',
      title: 'Visit of H.H The Catholicos to the Vatican',
      date: '2013',
      photoCount: 10,
      category: 'Ecumenical Visits',
      imageUrl: '/images/gallery/vatican-visit-5.jpg',
    },
  ];

  const categories = ['All', 'Major Events', 'Ecumenical Visits', 'Special Events', 'Private Audiences', 'Receptions', 'Liturgical Events', 'Church Visits', 'Conferences'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-muted py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center sacred-shadow">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="font-heading font-semibold text-4xl lg:text-5xl text-foreground mb-4">
              Photo Gallery
            </h1>
            <p className="font-body text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Commemorating significant moments in the life of our church through ecumenical visits, major ceremonies, and special events.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-heading font-bold text-4xl text-primary mb-2">{albums.length}</div>
              <div className="font-body text-sm text-muted-foreground">Photo Albums</div>
            </div>
            <div className="text-center">
              <div className="font-heading font-bold text-4xl text-primary mb-2">{albums.reduce((sum, album) => sum + album.photoCount, 0)}+</div>
              <div className="font-body text-sm text-muted-foreground">Photographs</div>
            </div>
            <div className="text-center">
              <div className="font-heading font-bold text-4xl text-primary mb-2">10+</div>
              <div className="font-body text-sm text-muted-foreground">Years Documented</div>
            </div>
            <div className="text-center">
              <div className="font-heading font-bold text-4xl text-primary mb-2">15+</div>
              <div className="font-body text-sm text-muted-foreground">Countries Visited</div>
            </div>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
              Browse Albums
            </h2>
            <p className="font-body text-muted-foreground">
              Explore our collection of memorable moments and significant events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, index) => {
              // Create varied gradients for visual interest
              const gradients = [
                'from-amber-100 via-orange-50 to-amber-100',
                'from-stone-100 via-amber-50 to-stone-100',
                'from-yellow-50 via-amber-100 to-yellow-50',
                'from-orange-50 via-stone-100 to-orange-50',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
              <Link
                key={album.id}
                href={`/mosc/gallery/${album.id}`}
                className="group bg-card rounded-lg sacred-shadow hover:sacred-shadow-lg reverent-transition overflow-hidden block"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {/* Album Image */}
                  {album.imageUrl ? (
                    <Image
                      src={album.imageUrl}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 reverent-transition"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      {/* Decorative Cross Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg className="w-32 h-32 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 2h4v7h7v4h-7v9h-4v-9H3v-4h7V2z" />
                        </svg>
                      </div>
                      {/* Photo Icon */}
                      <svg className="w-16 h-16 text-primary/50 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-medium shadow-md">
                    {album.photoCount} photos
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-body font-medium rounded-full">
                      {album.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary reverent-transition">
                    {album.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {album.date}
                  </p>
                  <div className="flex items-center font-body text-primary text-sm font-medium">
                    <span>View Album</span>
                    <svg className="w-4 h-4 ml-1 group-hover:ml-2 reverent-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </section>

      {/* Note Section */}
      <section className="py-12 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary/5 rounded-lg p-8 border-l-4 border-primary">
            <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
              Photo Gallery Archive
            </h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              This gallery showcases significant events in the life of our church, including ecumenical visits, major ceremonies, and special occasions. Each album captures precious moments of fellowship, worship, and service that define our Orthodox Christian journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

