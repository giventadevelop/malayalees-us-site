import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H.G. Dr. Geevarghese Mar Yulios Metropolitan',
  description: 'Biography and information about H.G. Dr. Geevarghese Mar Yulios Metropolitan.',
};

const hgdrgeevarghesemarjuliusmetropolitanPage = () => {
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
              H.G. Dr. Geevarghese Mar Yulios Metropolitan
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
                    src="/images/holy-synod/geevarghese-mar-yulios.jpg"
                    alt="H.G. Dr. Geevarghese Mar Yulios Metropolitan"
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
                      His Grace Dr. Geevarghese Mar Yulios, Bishop and Metropolitan in the Malankara Orthodox Syrian Church, was born on May 17, 1967, to Late Mr. P. V. Pavu and Mrs. K. V. Anna. He hails from the Pulikkottil Family, Kunnamkulam, and is a member of St. Mathias Parish, Thekke Angaadi, Kunnamkulam. His current residence is the Bishop's House, Arthat, Kunnamkulam.
His Grace was ordained as a sub-deacon on April 27, 1990, at St. Mary's Church, Arthat, and as a deacon on March 7, 1992, at Arthat Aramana Chapel. He was ordained as a priest (Kassissa) on March 14, 1992, by Paulose Mar Milithios. He was later elevated to the monastic rank (Ramban) on March 21, 2010, by His Holiness Baselios Didymos I at Parumala Seminary Chapel. On May 12, 2010, he was consecrated as a Metropolitan by His Holiness Baselios Didymos I at the Kottayam Mar Elia Cathedral and received the title Pulikkottil Dr. Geevarghese Mar Yulios Metropolitan.
His academic path began at St. Joseph's School, Kunnamkulam, after which he completed a B.Sc. in Mathematics from St. Aloysius College, Elthuruth (affiliated with Calicut University). His theological education includes GST and BD from the Old Seminary, Kottayam, and a Master of Theology (M.Th.) from the Gurukul Lutheran Theological College, Madras (affiliated with Serampore University). He earned his Ph.D. in Theology of Religions from the Friedrich-Alexander University of Erlangen, Germany, and later pursued post-doctoral research at the University of Chicago, USA. He is proficient in German and holds diplomas in Sanskrit, Latin, Greek, and Hebrew.
In his pastoral and academic service, His Grace began teaching in 1994 as a Lecturer/Professor of Religion and Philosophy at the Orthodox Theological Seminary, Kottayam, and from 1995 at the St. Thomas Orthodox Theological Seminary, Nagpur. He held several administrative positions including Bursar of the Nagpur Seminary, Registrar of the Divyabodhanam Programme (1995–1997), Programme Secretary of the Sophia Centre for Inter-religious Dialogue and Cultural Studies, Kottayam, Assistant Warden at the Seminary, and Associate Secretary of the Kerala Council of Churches.
His Grace has served as vicar in various dioceses including Kunnamkulam, Madras, Kottayam, UK-Europe-Africa, South-West America, and North-East America. From 2010 to 2022, he served as the Metropolitan of the Diocese of Ahmedabad, and since November 2022, he has been the Metropolitan of the Diocese of Kunnamkulam.
In his wider ecclesial and academic leadership roles, His Grace serves as President of the National Council of Churches in India, Chairman of the Henry Martyn Institute, Hyderabad, Senior Professor at Serampore College, Research Guide at Martin Luther Christian University, Shillong, and President of the Orthodox Christian Youth Movement (OCYM).
His contributions to theological research and interfaith engagement are widely recognized. He is a member of the Association of Professors and Research Scholars in Germany for the Study of Religion and Philosophy since 2002, a Resource Person for Oriental Studies, and has continued to serve in ecumenical roles.
Dr. Geevarghese Mar Yulios has authored over 10 publications in the fields of theology, language, and inter-religious dialogue. Notable among them are Mathangalude Sandesham (1995) and Message of the Religions (1995, Revised Edition 2019).
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      H.G. Dr. Geevarghese Mar Yulios served as the Metropolitan of Ahmedabad Diocese from 2010 to 2022. From 2022 November onwards, His Grace is serving as the Metropolitan of the Kunnamkulam Diocese.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Address: Bishop's House, Arthat, Kunnamkulam - 680 521
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Ph:  9447383931
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Email: hgyulios@gmail.com, mockkmdiocese@yahoo.in
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
                    href="/mosc/holy-synod/h-g-dr-geevarghese-mar-julius-metropolitan" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H.G. Dr. Geevarghese Mar Yulios Metropolitan
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

export default hgdrgeevarghesemarjuliusmetropolitanPage;