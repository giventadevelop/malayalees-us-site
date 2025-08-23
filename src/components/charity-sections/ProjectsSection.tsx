'use client';

import React from 'react';

const projects = [
  {
    id: 1,
    title: 'Helping in village houses',
    category: 'Building',
    description: 'Pink salmon cherry salmon combtail gourami frigate mackerel snake.',
    color: '#37E085'
  },
  {
    id: 2,
    title: 'Building school in Africa',
    category: 'Building',
    description: 'Pink salmon cherry salmon combtail gourami frigate mackerel snake.',
    color: '#FF8159'
  },
  {
    id: 3,
    title: 'Water delivery in hot places',
    category: 'Water',
    description: 'Pink salmon cherry salmon combtail gourami frigate mackerel snake.',
    color: '#34BDC6'
  },
  {
    id: 4,
    title: 'Help with education',
    category: 'Education',
    description: 'Pink salmon cherry salmon combtail gourami frigate mackerel snake.',
    color: '#FFCE59'
  }
];

const ProjectsSection: React.FC = () => {
  return (
    <div className="py-24 bg-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-2 bg-yellow-400 rounded"></div>
            <p className="text-white/70">Projects</p>
          </div>

          <h2 className="text-4xl md:text-6xl font-normal leading-tight tracking-tight max-w-4xl">
            Our latest projects around the world
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:-translate-y-2 hover:bg-white/15 transition-all duration-300 ease-in-out"
            >
              <div
                className="w-3 h-3 rounded-full mb-4"
                style={{ backgroundColor: project.color }}
              ></div>

              <h3 className="text-lg font-semibold mb-3">
                {project.title}
              </h3>

              <div className="mb-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${project.color}20`,
                    color: project.color
                  }}
                >
                  {project.category}
                </span>
              </div>

              <p className="text-white/80 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;