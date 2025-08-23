'use client';

import React from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';

const AboutSection: React.FC = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-16 items-start">
          <div className="flex-1">
            {/* Section Header */}
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-2 bg-yellow-400 rounded"></div>
                <p className="text-gray-600">About foundation</p>
              </div>

              <h2 className="text-4xl md:text-6xl font-normal leading-tight tracking-tight mb-8">
                Hard times for the world & opportunities to help people in need
              </h2>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-900 font-medium">
                Halosaur duckbilled barracudina, goosefish gar pleco, chum salmon armoured catfish gudgeon sawfish whitefish orbicular batfish
              </p>

              <p className="text-base leading-relaxed text-gray-600">
                Mummichog paradise fish! Triggerfish bluntnose knifefish upside-down catfish cobia spookfish convict cichlid, &ldquo;cat shark; saw shark trout cod&rdquo;.
              </p>

              <div className="pt-4">
                <button className="bg-transparent text-gray-900 border border-yellow-400 rounded-full px-6 py-3 text-sm font-medium hover:bg-yellow-400 hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-in-out flex items-center space-x-2">
                  <span>Explore more</span>
                  <ArrowRightIcon width={16} height={16} color="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;