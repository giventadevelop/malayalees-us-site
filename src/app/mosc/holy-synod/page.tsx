import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Holy Synod',
  description: 'Meet the spiritual leaders and bishops of the Malankara Orthodox Syrian Church Holy Synod.',
};

const HolySynodPage = () => {
  const synodMembers = [
    {
      name: 'H.H. Baselios Marthoma Mathews III',
      title: 'The Ninth Catholicos of the East in Malankara',
      href: '/mosc/holy-synod/his-holiness-baselios-marthoma-mathews-iii',
      special: true
    },
    {
      name: 'H. G. Dr. Thomas Mar Athanasius Metropolitan',
      href: '/mosc/holy-synod/his-grace-dr-thomas-mar-athanasius',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Yuhanon Mar Meletius Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-yuhanon-mor-meletius-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Kuriakose Mar Clemis Metropolitan',
      href: '/mosc/holy-synod/his-grace-kuriakose-mar-clemis',
      title: 'Metropolitan'
    },
    {
      name: 'H.G.Geevarghese Mar Coorilos Metropolitan',
      href: '/mosc/holy-synod/his-grace-geevarghese-mar-coorilose-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Zachariah Mar Nicholovos Metropolitan',
      href: '/mosc/holy-synod/h-g-zachariah-mar-nicholovos-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Yakoob Mar Irenaios Metropolitan',
      href: '/mosc/holy-synod/his-grace-jacob-mar-irenios',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Gabriel Mar Gregorios Metropolitan',
      href: '/mosc/holy-synod/his-grace-dr-gabriel-mar-gregorios',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan',
      href: '/mosc/holy-synod/his-grace-dr-yoohanon-mar-chrysostamus',
      title: 'Metropolitan'
    },
    {
      name: 'H.G.Yuhanon Mar Policarpos Metropolitan',
      href: '/mosc/holy-synod/h-g-youhanon-mar-polycarpus-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H. G. Mathews Mar Theodosius Metropolitan',
      href: '/mosc/holy-synod/h-g-mathews-mar-theodosius',
      title: 'Metropolitan'
    },
    {
      name: 'H.G.Dr. Joseph Mar Dionysius Metropolitan',
      href: '/mosc/holy-synod/h-g-joseph-mar-dionysius-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H. G. Abraham Mar Epiphanios Metropolitan',
      href: '/mosc/holy-synod/h-g-abraham-mar-epiphanios',
      title: 'Metropolitan'
    },
    {
      name: 'H. G. Dr. Mathews Mar Thimothios Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-mathews-mar-thimothios-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H. G. Alexios mar Eusebius Metropolitan',
      href: '/mosc/holy-synod/h-g-alexios-mar-eusebius-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Yuhanon Mar Diascoros Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-yuhanon-mar-dioscoros-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Youhanon Mar Demetrios Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-yuhanon-mar-demetrius-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr.Yuhanon Mar Thevodoros Metropolitan',
      href: '/mosc/holy-synod/h-g-yuhanon-mar-theodorus-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Yakob Mar Elias Metropolitan',
      href: '/mosc/holy-synod/h-g-yakoob-mar-elias-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H. G. Dr.Joshua Mar Nicodimos Metropolitan',
      href: '/mosc/holy-synod/h-g-joshua-mar-nicodemus-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Zacharias Mar Aprem Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-zacharias-mar-aprem-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Geevarghese Mar Yulios Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-geevarghese-mar-julius-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Abraham Mar Seraphim Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-abraham-mar-seraphim-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Abraham Mar Stephanos Metropolitan',
      href: '/mosc/holy-synod/h-g-abraham-mar-stephanos-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Thomas Mar Ivanios Metropolitan',
      href: '/mosc/holy-synod/h-g-thomas-mar-ivanios-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Geevarghese Mar Theophilos Metropolitan',
      href: '/mosc/holy-synod/hg-dr-geevarghese-mar-theophilos-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Geevarghese Mar Philoxenos Metropolitan',
      href: '/mosc/holy-synod/h-g-geevarghese-mar-philaxenos-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Geevarghese Mar Pachomios Metropolitan',
      href: '/mosc/holy-synod/h-g-geevarghese-mar-pachomios-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Dr. Geevarghese Mar Barnabas Metropolitan',
      href: '/mosc/holy-synod/h-g-dr-geevarghese-mar-barnabas-metropolitan',
      title: 'Metropolitan'
    },
    {
      name: 'H.G. Zachariah Mar Severios Metropolitan',
      href: '/mosc/holy-synod/h-g-zacharia-mar-severios-metropolitan',
      title: 'Metropolitan'
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6 sacred-shadow-lg">
              <span className="text-primary-foreground text-4xl font-bold" role="img" aria-label="Holy Synod">👥</span>
            </div>
            <h1 className="font-heading font-semibold text-4xl text-foreground mb-4">
              Holy Synod
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The Holy Synod consists of all the bishops of the Malankara Orthodox Syrian Church,
              serving as the highest governing body under the leadership of the Catholicos.
            </p>
          </div>
        </div>
      </section>

      {/* Current Catholicos */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
              His Holiness the Catholicos
            </h2>
          </div>

          <div className="bg-background rounded-lg sacred-shadow p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl" role="img" aria-label="Catholicos">👑</span>
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

      {/* Synod Members */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
              Synod Members
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
              The bishops and metropolitans who serve as spiritual leaders and administrators
              of their respective dioceses within the church.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {synodMembers.slice(1).map((member) => (
              <Link
                key={member.name}
                href={member.href}
                className="bg-card rounded-lg sacred-shadow p-6 hover:sacred-shadow-lg reverent-transition group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 reverent-transition">
                    <span className="text-2xl text-primary" role="img" aria-label="Bishop">👨‍💼</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary reverent-transition">
                    {member.name}
                  </h3>
                  <p className="font-body text-sm text-primary font-medium">
                    {member.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Holy Synod */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading font-semibold text-3xl text-foreground mb-6">
                About the Holy Synod
              </h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>
                  The Holy Synod is the highest governing body of the Malankara Orthodox Syrian Church,
                  consisting of all the bishops and metropolitans under the leadership of the Catholicos.
                </p>
                <p>
                  The Synod meets regularly to discuss and decide on matters of faith, doctrine,
                  administration, and the general welfare of the church. All major decisions
                  affecting the church are made through the consensus of the Synod.
                </p>
                <p>
                  Each member of the Synod is responsible for the spiritual and administrative
                  oversight of their respective diocese, ensuring that the teachings and traditions
                  of the church are preserved and propagated faithfully.
                </p>
              </div>
            </div>

            <div className="bg-background rounded-lg sacred-shadow p-6">
              <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                Synod Responsibilities
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-primary text-xl" role="img" aria-label="Faith">⛪</span>
                  <div>
                    <h4 className="font-heading font-medium text-foreground">Faith & Doctrine</h4>
                    <p className="font-body text-muted-foreground text-sm">Preserving and teaching Orthodox faith</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary text-xl" role="img" aria-label="Administration">🏛️</span>
                  <div>
                    <h4 className="font-heading font-medium text-foreground">Administration</h4>
                    <p className="font-body text-muted-foreground text-sm">Overseeing church governance and structure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary text-xl" role="img" aria-label="Spiritual">🙏</span>
                  <div>
                    <h4 className="font-heading font-medium text-foreground">Spiritual Guidance</h4>
                    <p className="font-body text-muted-foreground text-sm">Providing pastoral care and spiritual direction</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary text-xl" role="img" aria-label="Unity">🤝</span>
                  <div>
                    <h4 className="font-heading font-medium text-foreground">Unity & Fellowship</h4>
                    <p className="font-body text-muted-foreground text-sm">Maintaining church unity and communion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HolySynodPage;














