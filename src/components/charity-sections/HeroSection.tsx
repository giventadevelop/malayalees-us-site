'use client';

import React from 'react';
import PlayIcon from './icons/PlayIcon';

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: 'url(/images/charity-theme/hero_background.jpg)' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <h1 className="text-4xl md:text-7xl font-normal tracking-tight leading-tight max-w-4xl">
            Charity for{' '}
            <span className="text-yellow-400">
              people
            </span>
          </h1>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="bg-white/90 hover:bg-white text-gray-900 rounded-full px-8 py-4 flex items-center space-x-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out">
              <PlayIcon width={20} height={20} color="currentColor" />
              <span>Watch Video</span>
            </button>

            <div className="bg-white/95 text-gray-900 px-6 py-4 rounded-xl backdrop-blur-md">
              <p className="text-sm text-gray-600 mb-1">
                Call us today!
              </p>
              <p className="text-xl font-semibold">
                1-800 572 61 49
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;