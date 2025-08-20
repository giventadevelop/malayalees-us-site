import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Charity Theme - Nonprofit Organization & Fundraising',
  description: 'The long journey to end poverty begins with a child. Join our mission to help people in need around the world through education, healthcare, and community development.',
  keywords: 'charity, nonprofit, donation, philanthropy, fundraising, volunteer, education, healthcare, clean water, emergency relief, community development',
  openGraph: {
    title: 'Charity Theme - Nonprofit Organization & Fundraising',
    description: 'The long journey to end poverty begins with a child. Join our mission to help people in need around the world through education, healthcare, and community development.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charity Theme - Nonprofit Organization & Fundraising',
    description: 'The long journey to end poverty begins with a child. Join our mission to help people in need around the world through education, healthcare, and community development.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CharityThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Font imports */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Epilogue:wght@100;200;300;400;500;600;700;800;900&family=Sora:wght@100;200;300;400;500;600;700;800;900&family=Meow+Script:wght@400&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      {/* Completely independent layout - no root app Header/Footer */}
      <div className="charity-theme-layout">
        {children}
      </div>
    </>
  );
}