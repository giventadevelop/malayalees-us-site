'use client';

import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-[37.5vh] bg-white pt-20 pb-9 relative">
      {/* Donate Image - Top Right Corner */}
      <div className="absolute top-6 right-6 z-50">
        <Image
          src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fee43fae6623544d193ab0c26deca1d95?format=webp&width=800"
          alt="Donate"
          width={120}
          height={60}
          className="cursor-pointer hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout - Mobile: First column cells side by side, second column below; Desktop: custom columns */}
        <div className="grid gap-8 h-full min-h-[300px]">

          {/* Mobile layout: First column cells in same row */}
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {/* Cell 1: Logo - Simple image and text */}
            <div className="relative overflow-hidden group min-h-[187px] flex flex-col items-center justify-center p-4">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fd7543f582d4f477599d341da96d48e2b?format=webp&width=800"
                alt="Malayalees Friends Logo"
                width={180}
                height={180}
                className="mx-auto mb-3"
                priority
              />
              <h2 className="text-lg font-bold text-gray-800 text-center">
                Malayalees Friends
              </h2>
              <p className="text-sm text-gray-600 mt-1 text-center">
                Cultural Events Federation
              </p>
            </div>

            {/* Cell 3: Unite India Image - No text overlay */}
            <div className="relative overflow-hidden group min-h-[187px] rounded-[2rem]">
              <div
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  background: `url('https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F7e04d4cf965b47f9b58322797a9f4ba2?format=webp&width=800') center/cover`,
                  filter: 'brightness(0.9) contrast(1.1)'
                }}
              ></div>
            </div>

          </div>

          {/* Cell 2: Large Modern Image - Mobile */}
          <div className="relative overflow-hidden group min-h-[225px] lg:hidden">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F67c8b636de774dd2bb5d7097f5fcc176?format=webp&width=800"
              alt="Kerala Cultural Collage"
              fill
              className="object-contain"
              style={{
                filter: 'contrast(1.1) saturate(0.9)'
              }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Desktop layout: Original grid with modifications */}
          <div className="hidden lg:grid lg:grid-cols-[3fr_7fr] gap-8 items-end">

            {/* Cell 1: Logo - Simple image and text */}
            <div className="relative overflow-hidden group h-[262px] flex flex-col items-center justify-center">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2Fd7543f582d4f477599d341da96d48e2b?format=webp&width=800"
                alt="Malayalees Friends Logo"
                width={240}
                height={240}
                className="mx-auto mb-4"
                priority
              />
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Malayalees Friends
              </h2>
              <p className="text-base text-gray-600 mt-2 text-center">
                Cultural Events Federation
              </p>
            </div>

            {/* Cell 2: Large Modern Image - Must bleed to ALL edges without truncation */}
            <div className="relative lg:row-span-2 group h-[531px]">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F67c8b636de774dd2bb5d7097f5fcc176?format=webp&width=800"
                alt="Kerala Cultural Collage"
                fill
                className="object-fill w-full h-full"
                style={{
                  filter: 'contrast(1.1) saturate(0.9)'
                }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Cell 3: Unite India Image - No text overlay */}
            <div className="relative overflow-hidden group h-[262px] rounded-[2rem]">
              <div
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  background: `url('https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F7e04d4cf965b47f9b58322797a9f4ba2?format=webp&width=800') center/contain`,
                  backgroundRepeat: 'no-repeat',
                  filter: 'brightness(0.9) contrast(1.1)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;