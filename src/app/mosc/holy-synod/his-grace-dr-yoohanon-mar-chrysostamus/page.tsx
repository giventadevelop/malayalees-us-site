import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan',
  description: 'Biography and information about H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan.',
};

const hisgracedryoohanonmarchrysostamusPage = () => {
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
              H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan
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
                    src="/images/holy-synod/yuhanon-mar-chrisostomos.jpg"
                    alt="H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan"
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
                      His Grace was born in 1954 to Mr KV Yohannan and Mrs Aleyamma Yohannan, Mannil Puthen Purayil, Kottoor, Thiruvalla. Varghese had his early education in local schools at Kottoor, and college education at SB College, Chenganachery. After his BSc from the University of Kerala, he joined Orthodox Theological Seminary, Kottayam, and took his GST and BD from Serampore University. He did his MTh from United Theological College, Bangalore, and PhD from The San Francisco Theological Seminary.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Metropolitan Geevarghese Mar Osthathios ordained Varghese John a deacon on 19 April 1982, and got his priesthood from HH Baselios Marthoma Mathews II on 5 June 1982. On 28 January 1998, H.H. Baselios Marthoma Mathews II made him a Ramban at Parumala Seminary. Ramban Yoohanon was the Secretary of the Karunagiri MGD Ashram and Balabhavan.  He has held the post of Principal, St Paul's Mission Training Center, Mavelikkara, visiting faculty of St Thomas Orthodox Theological Seminary, Nagpur, coordinator of Malankara Orthodox Mission Board, St Thomas Karunya Guidance Center, Ulloor, Trivandrum, Karunya Vishranthi Bhavan Kattela, Trivandrum, Marriage Assistance Foundation (MAF), Sick Aid Foundation (SAF), Member of Malankara Association Managing Committee, Council Member of Parumala Seminary, Member of Catholic-Orthodox Dialogue Commission and many other posts of distinction. Besides being a scholar, exceptionally good organizer, preacher at conventions, he has participated in and given leadership to many meetings and also to many conferences.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Yoohanon Ramaban was elevated to the post of Metropolitan on 5 March 2005 by HH Baselios Mathews II along with His Grace Mar Gregorios, His Grace Mar Theophilos, and His Grace Mar Dionysius at Parumala Seminary. He took the mantle of Niranam Diocese from illustrious His Grace Mar Osthathios.
His Grace has widely travelled in the Gulf, the US and in the European countries. He is working tirelessly to transform the Church into a missionary Church.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Present Address: Bethany Aramana, Thiruvalla, Kerala – 689 101
Tel.: 0469-2701357/2603357
Fax: 0469-2342709
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Mob: 9447045543
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Email: yuhanonmarchrysostomos@gmail.com
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
                    href="/mosc/holy-synod/his-grace-dr-yoohanon-mar-chrysostamus" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H.G. Dr. Yuhanon Mar Chrisostomos Metropolitan
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

export default hisgracedryoohanonmarchrysostamusPage;