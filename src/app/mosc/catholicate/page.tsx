import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'The Catholicate',
  description: 'Learn about the Catholicate of the Malankara Orthodox Syrian Church, its history, and the spiritual leadership of our Catholicos.',
};

const CatholicatePage = () => {
  const catholicosHistory = [
    {
      name: 'H.H. Baselios Paulos I',
      period: '1912–1913',
      description: 'The First Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-paulos-i-1st-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/Untitled-11.jpg'
    },
    {
      name: 'H.H. Baselios Geevarghese I',
      period: '1925–1928',
      description: 'The Second Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-geevarghese-i-second-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/Untitled-12.jpg'
    },
    {
      name: 'H.H. Baselios Geevarghese II',
      period: '1929–1964',
      description: 'The Third Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-geevarghese-ii-third-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/geevar.jpg'
    },
    {
      name: 'H.H. Baselios Augen I',
      period: '1964–1975',
      description: 'The Fourth Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-oughen-i-the-fourth-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/augen.jpg'
    },
    {
      name: 'H.H. Baselios Marthoma Mathews I',
      period: '1975–1991',
      description: 'The Fifth Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-marthoma-mathews-i-fifth-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/mathews-i.jpg'
    },
    {
      name: 'H.H. Baselios Marthoma Mathews II',
      period: '1991–2005',
      description: 'The Sixth Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-marthoma-mathews-ii-sixth-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/sas.jpg'
    },
    {
      name: 'H.H. Baselios Marthoma Didymos I',
      period: '2005-2010',
      description: 'The Seventh Catholicos of the East in Malankara',
      href: '/mosc/catholicate/his-holiness-baselios-marthoma-didymos-i-seventh-catholicos-of-the-east-in-malankara',
      image: '/images/catholicate/didymus.jpg'
    },
    {
      name: 'H.H. Baselios Marthoma Paulose II',
      period: '2010–2021',
      description: 'The Eighth Catholicos of the East in Malankara',
      href: '/mosc/catholicate/h-h-baselios-marthoma-paulose-ii',
      image: '/images/catholicate/bava.jpg'
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6 sacred-shadow-lg">
              <span className="text-primary-foreground text-4xl font-bold" role="img" aria-label="Crown">👑</span>
            </div>
            <h1 className="font-heading font-semibold text-4xl text-foreground mb-4">
              The Catholicate of the Malankara Orthodox Syrian Church
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The Catholicate represents the highest spiritual and administrative authority in the Malankara Orthodox Syrian Church,
              embodying the apostolic succession and ecclesiastical governance of our ancient tradition.
            </p>
          </div>
        </div>
      </section>

      {/* Current Catholicos */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
              Current Catholicos
            </h2>
          </div>

          <div className="bg-background rounded-lg sacred-shadow p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl" role="img" aria-label="Current Catholicos">👑</span>
              </div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                H.H. Baselios Marthoma Mathews III
              </h3>
              <p className="font-body text-lg text-primary mb-4">
                The Ninth Catholicos of the East in Malankara
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/mosc/holy-synod/his-holiness-baselios-marthoma-mathews-iii"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 reverent-transition"
                >
                  <span className="mr-2" role="img" aria-label="Biography">📋</span>
                  Biography
                </Link>
                <Link
                  href="/mosc/photo-gallery/reception-to-his-holiness-baselios-marthoma-mathews-iii"
                  className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 reverent-transition"
                >
                  <span className="mr-2" role="img" aria-label="Photos">📸</span>
                  Photos
                </Link>
                <Link
                  href="/mosc/speeches"
                  className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 reverent-transition"
                >
                  <span className="mr-2" role="img" aria-label="Speeches">🎤</span>
                  Speeches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Catholicos */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
              Historical Catholicos
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
              Learn about the spiritual leaders who have guided our church through history,
              each contributing to the rich legacy of the Malankara Orthodox tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {catholicosHistory.map((catholicos) => (
              <Link
                key={catholicos.name}
                href={catholicos.href}
                className="bg-card rounded-lg sacred-shadow p-4 hover:sacred-shadow-lg reverent-transition group w-full max-w-xs"
              >
                <div className="text-center">
                  <div className="w-full h-48 mx-auto mb-4 rounded-lg overflow-hidden sacred-shadow-sm group-hover:sacred-shadow reverent-transition">
                    <Image
                      src={catholicos.image}
                      alt={catholicos.name}
                      width={300}
                      height={192}
                      className="w-full h-full object-cover group-hover:scale-105 reverent-transition"
                    />
                  </div>
                  <h3 className="font-heading font-semibold text-base text-foreground mb-2 group-hover:text-primary reverent-transition">
                    {catholicos.name}
                  </h3>
                  <p className="font-body text-xs text-primary mb-2 font-medium">
                    {catholicos.period}
                  </p>
                  <p className="font-body text-muted-foreground text-xs leading-relaxed">
                    {catholicos.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catholicate Information */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading font-semibold text-3xl text-foreground mb-6">
                About the Catholicate
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  The Catholicate of the East in Malankara represents the highest ecclesiastical authority
                  in the Malankara Orthodox Syrian Church. Established in 1912, it serves as the spiritual
                  and administrative center of our ancient apostolic tradition.
                </p>
                <p>
                  The Catholicos, as the supreme head of the church, holds the responsibility for spiritual
                  guidance, ecclesiastical governance, and the preservation of our rich Orthodox heritage.
                  This office embodies the apostolic succession and maintains the unity of our church.
                </p>
                <p>
                  Through the centuries, our Catholicos have guided the church through various challenges,
                  preserving the faith while adapting to the needs of our community. Their leadership
                  continues to inspire and guide millions of faithful worldwide.
                </p>
              </div>
            </div>

            <div className="bg-background rounded-lg sacred-shadow p-6">
              <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                Catholicate Palace
              </h3>
              <div className="space-y-3 font-body text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Location:</span><br />
                  Devalokam, Kottayam<br />
                  Kerala, India
                </p>
                <p>
                  <span className="font-medium text-foreground">Established:</span> 1912
                </p>
                <p>
                  <span className="font-medium text-foreground">Current Catholicos:</span><br />
                  H.H. Baselios Marthoma Mathews III
                </p>
                <p>
                  <span className="font-medium text-foreground">Succession:</span> Ninth Catholicos of the East
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatholicatePage;





