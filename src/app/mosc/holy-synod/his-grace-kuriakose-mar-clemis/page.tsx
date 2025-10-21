import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H.G. Kuriakose Mar Clemis Metropolitan',
  description: 'Biography and information about H.G. Kuriakose Mar Clemis Metropolitan.',
};

const hisgracekuriakosemarclemisPage = () => {
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
              H.G. Kuriakose Mar Clemis Metropolitan
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
                    src="/images/holy-synod/kuriakose-mar-clemis.jpg"
                    alt="H.G. Kuriakose Mar Clemis Metropolitan"
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
                      His Grace was born in 1936 at Nellikkal, Koipram Village in Thiruvalla Taluk as the second son to Perumethmannil Mr PK Mathai and Mrs Sosamma.  He has one brother and two sisters.  He belongs to Koorthamala St.Mary's Orthodox Church in Chengannur  Diocese.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      After his schooling, he joined Kerala University and did his graduation, post graduation in Science and  B.Ed from Catholicate College, Pathanahitta and Mount Tabore Training College Pathanapuram respectively. Thereupon His Grace was teaching Botany at Catholicate College, Pathanamthitta, until he was elected to the Episcopal order.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      He became a priest in 1964 after his studies at Orthodox Theological Seminary, Kottayam. He was also a member of St Basil Daya, Pathanamthitta. His Grace also served the Thumpamon Diocese as Secretary of Priests, Thumpamon Diocese. He was ordained a Bishop in 1991 and was given charge of the newly formulated Sultan Battery Diocese.  And is serving it with all vigour and enthusiasm. His spiritual strength has helped the diocese to grow in all aspects within a short span of time.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace is actively involved in many social activities. He is the President of a special school for mentally challenged children--Olivemala and Baselious Gregorios Mercy Home.  He has so far extended helping hands  poor  and  also runs a secret fund and educational fund for the economically weaker sections.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace has many published articles to his credit. He is known for his simplicity and sweet voice.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Address: Basil Aramana ,Pathanamthitta -689 645
Tel.: 0468-2222243 /9495694429
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Email: hgmarclemis@gmail.com
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
                    href="/mosc/holy-synod/his-grace-kuriakose-mar-clemis" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H.G. Kuriakose Mar Clemis Metropolitan
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

export default hisgracekuriakosemarclemisPage;