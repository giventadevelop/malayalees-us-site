import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'H. G. Alexios mar Eusebius Metropolitan',
  description: 'Biography and information about H. G. Alexios mar Eusebius Metropolitan.',
};

const hgalexiosmareusebiusmetropolitanPage = () => {
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
              H. G. Alexios mar Eusebius Metropolitan
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
                    src="/images/holy-synod/alexios-mar-eusebius.jpg"
                    alt="H. G. Alexios mar Eusebius Metropolitan"
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
                      His Grace Alexios Mar Eusebius, formerly Rev. Fr. Alex Daniel is a member of St. George Orthodox Church, Puthoor of Kollam Diocese.  Thirumeni hails from Vattakkattu family, Puthoor.  His Grace was born on 5th September, 1964 as the fourth son of late Sri Y. Daniel and Smt. Chinnamma Daniel. The late Rev. Fr. V.J. Jacob Vattakkattu is his paternal uncle.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace graduated from Kerala University with Bachelor's degree in Science. He then joined Bangalore University for legal studies and secured LL.B. After completing his secular studies, he devoted himself for theological studies and joined the Orthodox Theological seminary, Kottayam. He completed Graduation in Sacred Theology from Orthodox Theological seminary and Bachelor of Divinity from Serampore University, Calcutta. Pursuing his post-graduation, he secured Master's Degree in Theology from St. Peter's Pontifical Institute of Theology, Bangalore. He acquired a Diploma in Biblical Geography from Tantur Ecumenical Institute, Jerusalem and conducted his Doctoral Research Study in Old Testament from Friedrich Alexander University, Germany. He also practiced as a Civil Lawyer in the District Court of Kollam in 1994-95.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      On May 15,1993 he was ordained as a deacon and on 4th May 1995, H. H Baselious Marthoma Mathews II ordained him to the priesthood. As a priest he has served the parishes in Bangalore, Germany and in the Calcutta diocese.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      In 1997, His Grace was appointed as the faculty of Old Testament in St. Thomas Orthodox Theological Seminary, Nagpur.  During the period as the faculty (1997-2008) he served in different capacities like Warden, Director of Fieldwork and Bursar of the seminary.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      He has also served as the treasurer of the Orthodox Sunday School Association of the East (Outside Kerala Region), Director of Akhila Malankara Orthodox Shushrushaka Sangam (AMOSS - OKR), Director of OVBS (OKR) and as Treasurer of Prerana School for Mentally Challenged Children, Nagpur.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      His Grace handled the regular columns in the Malankara Sabha, Sahayatra, Parish Mission Literatures for the Outside Kerala Region. He has authored a book in Malayalam named "Vachanathejas", a compilation of Sunday Sermons for a complete liturgical year. His Grace has served and represented the Church in Ecumenical Conferences in India as well as abroad.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      The Malankara Syrian Christian association held at Pampakuda on 2008 September 11 elected him with six others to be metropolitans of the church. On 2009 February 19 H.H. Baselios Marthoma Didymus I Catholicos with the assistance of the holy Episcopal synod, ordained him as Metropolitan along with the six other candidates at Puthupally St. George Orthodox Church.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      When the Diocese of South-west America was formed in 2009, His Grace was appointed as the first Metropolitan of that Diocese from April 1, 2009.  He took leadership in building the Diocese from scratches.  The beautiful diocesan center at Beasley, Houston in 100 Acres is one of the greatest achievements in his time.  A Liturgical Resource Development Committee was formed and initiated to translate all our liturgical books to English Language. About 15 new churches and congregations were established in the cities where the Malankara Orthodox church Mission had not yet started.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      From 2022 November onwards, His Grace is serving as the  Metropolitan of the Calcutta Diocese.  Apart from the administrative responsibilities of the diocese H.G. Mar Eusebius currently holds the office of the vice president of Kerala Council of Churches.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Address:  St. Thomas Ashram, Kailash Nagar, Bhilai, Chattisgarh 490 001.
                    </p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                      Telephone: +91 8547058607;  Email: mareusebius@gmail.com
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
                    href="/mosc/holy-synod/h-g-alexios-mar-eusebius-metropolitan" 
                    className="block px-3 py-2 bg-primary text-primary-foreground rounded-md font-body text-sm reverent-transition"
                  >
                    H. G. Alexios mar Eusebius Metropolitan
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

export default hgalexiosmareusebiusmetropolitanPage;