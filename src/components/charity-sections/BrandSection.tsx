'use client';

import React from 'react';

const BrandSection: React.FC = () => {
  return (
    <div className="py-32 bg-gradient-to-br from-blue-700 to-blue-900 text-white relative overflow-hidden text-center">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="50" cy="50" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-6xl md:text-8xl lg:text-12xl font-semibold leading-none tracking-tighter mb-8 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
          Bec
        </div>

        <h2 className="text-2xl md:text-4xl font-normal tracking-tight mb-12 opacity-90">
          a volunteer
        </h2>

        <div className="text-3xl md:text-6xl font-semibold tracking-tight mb-16 bg-gradient-to-br from-green-400 to-cyan-400 bg-clip-text text-transparent">
          H2D Design
        </div>

        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join our community of volunteers and make a difference in the world.
          Together we can create positive change and help those in need.
        </p>

        <button className="bg-transparent text-yellow-400 border-2 border-yellow-400 rounded-full px-12 py-4 text-base font-medium hover:bg-yellow-400 hover:text-white hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default BrandSection;