'use client';

import React from 'react';
import Image from 'next/image';

const teamMembers = [
  {
    id: 1,
    name: 'Manoj Kizhakkoot',
    role: 'Founder & CEO',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F57d70c7941ba477fb3556ff7aab11f52?format=webp&width=800',
    bio: 'Passionate about making a difference in communities worldwide.',
    email: 'manoj@malayalees.org',
    expertise: ['Strategic Planning', 'Community Building', 'Cultural Events']
  },
  {
    id: 2,
    name: 'SRK',
    role: 'Operations Director',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fa70a28525f6f491aaa751610252a199c%2F386c7018a4a04c2b8dad6cbfc907b952?format=webp&width=800',
    bio: 'Expert in managing humanitarian projects and team coordination.',
    email: 'srk@malayalees.org',
    expertise: ['Project Management', 'Operations', 'Team Leadership']
  }
];

const TeamSection: React.FC = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end space-y-6 lg:space-y-0">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
              <p className="text-gray-600 font-medium">Our team</p>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-gray-900">
              Meet our amazing{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                team
              </span>
            </h2>
            <p className="text-lg text-gray-600 mt-4 leading-relaxed">
              Dedicated professionals working together to make a positive impact in our communities.
            </p>
          </div>
        </div>

        {/* Modern Team Grid with Fluid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Large Photo Section with Head Visibility */}
              <div className="relative h-[400px] lg:h-[450px] overflow-hidden p-4">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent z-10"></div>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectPosition: 'center top'
                    }}
                  />

                  {/* Subtle overlay for better photo quality */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 rounded-xl"></div>
                </div>
              </div>

              {/* Modern Card Content Below Photo */}
              <div className="p-8 bg-white">
                {/* Name and Role */}
                <div className="mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-base font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                    {member.role}
                  </p>
                </div>

                {/* Bio Description */}
                <p className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base">
                  {member.bio}
                </p>

                {/* Expertise Tags */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{member.email}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="mt-32 text-center">
          <div className="relative">
            <div className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter mb-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              15+
            </div>
            <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter opacity-10 blur-sm bg-gradient-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              15+
            </div>
          </div>
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">
            Years of experience in charity work
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Building stronger communities through dedication, innovation, and collaborative leadership.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;