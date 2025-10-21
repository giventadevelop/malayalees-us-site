import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H.G.Geevarghese Mar Coorilos Metropolitan',
  description: 'Biography and information about H.G.Geevarghese Mar Coorilos Metropolitan.',
};

const hisgracegeevarghesemarcoorilosemetropolitanPage = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6 sacred-shadow-lg">
              <span className="text-primary-foreground text-4xl font-bold" role="img" aria-label="Metropolitan">👨‍💼</span>
            </div>
            <h1 className="font-heading font-semibold text-4xl text-foreground mb-4">
              H.G.Geevarghese Mar Coorilos Metropolitan
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Metropolitan of the Malankara Orthodox Syrian Church
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-background rounded-lg sacred-shadow p-8">
                {/* Featured Image */}
                <div className="mb-8">
                  <Image
                    src="/images/holy-synod/geevarghese-mar-coorilos.jpg"
                    alt="H.G.Geevarghese Mar Coorilos Metropolitan"
                    width={500}
                    height={300}
                    className="rounded-lg sacred-shadow w-full h-auto"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">
                    Biography
                  </h2>

                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace was born on 7 October 1949 at Kollad, near Kottayam, to Mr PK Kurian and Mrs Mary Kurian of the Puliyeril family. After his schooling, young George had his pre-degree studies at CMS College Kottayam. He took his bachelors in arts from the Calicut University and MA from Sree Venkateshwara University. He did his BD from Orthodox Theological Seminary, Kottayam, and got post-graduate diploma in Pastoral Theology from Heythrop College London University and post-graduate diploma in Theology and Mission from Urban Theology Unit, Shefield, UK.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      He was ordained a sub-deacon in 1970 and a deacon in 1974 by Catholicos HH Baselios Mathews I. Dn George became a priest in 1975 and served as Vicar, St Gregorios Church, London. He is known for his works among students and thus was serving the MGOCSM as general secretary for almost a decade. This paved way for Fr George to visit many foreign countries.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      He was elected to the Episcopal rank in 1989 and thus became a monk in 1990 and was subsequently ordained in 1991. Soon, he was appointed as the Assistant Metropolitan, Mumbai Dioceses, and worked steadfast with late Dr Philipose Mar Theophilus for the progress of the Mumbai Diocese.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace has held many positions in the church and other Christian societies. He had attended many international conferences and interacted with many communities such as NCCI, CASA, WCC, and CMAI.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Present Address: Bombay Orthodox Church Centre, Dr.Mar Theophilus Marg, Sector X-A, Vashi, Juhu Nagar,  Navi Mumbai - 400 703
Tel.: 022-27669850, 022-27801427 ,  Mob: 09820333379
E-mail: orthodox77@hotmail.com, marcoorilos@yahoo.com
                    </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-lg sacred-shadow p-6 mb-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Holy Synod
                </h3>
                <nav className="space-y-2">
                  <Link 
                    href="/mosc/holy-synod" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Holy Synod Overview
                  </Link>
                  <Link 
                    href="/mosc/holy-synod/his-holiness-baselios-marthoma-mathews-iii" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    His Holiness the Catholicos
                  </Link>
                  <Link 
                    href="/mosc/holy-synod/his-grace-geevarghese-mar-coorilose-metropolitan" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H.G.Geevarghese Mar Coorilos Metropolitan
                  </Link>
                </nav>
              </div>

              {/* Quick Links */}
              <div className="bg-background rounded-lg sacred-shadow p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Quick Links
                </h3>
                <nav className="space-y-2">
                  <Link 
                    href="/mosc/downloads/kalpana" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Kalpana
                  </Link>
                  <Link 
                    href="/mosc/downloads" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Downloads
                  </Link>
                  <Link 
                    href="/mosc/institutions" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Institutions
                  </Link>
                  <Link 
                    href="/mosc/training" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Training
                  </Link>
                  <Link 
                    href="/mosc/publications" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Publications
                  </Link>
                  <Link 
                    href="/mosc/spiritual" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Spiritual Organisations
                  </Link>
                  <Link 
                    href="/mosc/theological" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Theological Seminaries
                  </Link>
                  <Link 
                    href="/mosc/lectionary" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Lectionary
                  </Link>
                  <Link 
                    href="/mosc/photo-gallery" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Gallery
                  </Link>
                  <Link 
                    href="/mosc/contact-info" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    Contact Info
                  </Link>
                  <Link 
                    href="/mosc/faqs" 
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md font-body text-sm reverent-transition"
                  >
                    FAQs
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default hisgracegeevarghesemarcoorilosemetropolitanPage;