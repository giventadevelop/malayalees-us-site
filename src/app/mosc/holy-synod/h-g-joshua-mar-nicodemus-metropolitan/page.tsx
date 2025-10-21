import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H. G. Dr.Joshua Mar Nicodimos Metropolitan',
  description: 'Biography and information about H. G. Dr.Joshua Mar Nicodimos Metropolitan.',
};

const hgjoshuamarnicodemusmetropolitanPage = () => {
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
              H. G. Dr.Joshua Mar Nicodimos Metropolitan
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
                    src="/images/holy-synod/joshua-mar-nicodimos.jpg"
                    alt="H. G. Dr.Joshua Mar Nicodimos Metropolitan"
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
                      His Grace was Born on 8th October 1962 as the youngest son of  Mr.Philipose Mathai and Mrs.Thankamma Mathai,  Sankarathil Nediyavilayil, Kurampala, Pandalam. Home  parish is St.Thomas Orthodox Valiyapally Kurampala, Pandalam, in the diocese of Chengannoor.
After completing the formal education secured M.A in Sociology from Kerala   University. Joined the Orthodox Theological Seminary, Kottayam in 1982 and secured GST and BD degrees. In 1996 S.T.M degree from General Theological Seminary, New York and completed MTh in Spiritual Theology from Indian Institute of Spirituality,             Bangalore in 2007.
In 1978 joined the Holy Trinity Ashram, Angadi, Ranni founded by H.G.Geevarghese Mar Dioscorus, as its first member. Became Korooyo in 1981 and Yaupadyakno in 1985. He was ordained  Full Deacon on 27th April 1986 and Priest on Nov. 1st, 1986 by                               H.G. Geevarghese Mar Dioscorus Metropolitan.
Served as vicar of three  parishes in Trivandrum and five parishes in  American dioceses from 1987 to 2003. Also served  as Secretary to H.G Geevarghese Mar Dioscorus at Trivandrum and  H.G Mathews Mar Barnabas Metropolitan at America. He served as  Aramana Chaplain at Ulloor, Trivandrum and manager of American Diocese office at NewYork from 1988 to 2003.
Upon the demise of Geevarghese Mar Dioscorus Metropolitan,  became Superior of the Holy Trinity Ashram in 1999 and continued till 2010. He was elevated as Yoohanon Ramban on 12th December 2003  by H.H. Baselios Marthoma Mathews II The Catholicos.
The Malankara Association held at Sasthamkotta on February 17, 2010 elected Yoohanon Ramban as Bishop candidate, and on May 12, 2010 H.H. Baselios Marthoma Didymos I, The Catholicos Consecrated  him as Metropolitan with the name Joshua Mar Nicodimos at Mar Elia Cathedral, Kottayam.
On August 15,2010 Joshua Mar Nicodimos was appointed as the Ist Metropolitan of the newly formed Nilackal Diocese. On May 18, 2011General Theological Seminary NewYork at its 188th Annual Commencement conferred upon him Doctor of Divinity,  honoris causa.  In February 2012 Holy Episcopal Synod appointed him as  the President of the Akhila Malankara Balasamajam.His Grace  is serving the Ranni- Nilackal Diocese as its Metro
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Address:
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Nilackal Orthodox Diocesan Centre, St.Thomas Aramana, Pazhavangadi. P.O, Ranni, Pathanamthitta- 689-673
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Mob: 9446600671
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Email: marnicodimos @gmail.com
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
                    href="/mosc/holy-synod/h-g-joshua-mar-nicodemus-metropolitan" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H. G. Dr.Joshua Mar Nicodimos Metropolitan
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

export default hgjoshuamarnicodemusmetropolitanPage;