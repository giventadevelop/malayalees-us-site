'use client';

import React from 'react';
import WaterDropIcon from './icons/WaterDropIcon';
import TreeIcon from './icons/TreeIcon';

const services = [
  {
    icon: <WaterDropIcon width={40} height={40} color="#34BDC6" />,
    title: 'Water delivery',
    description: 'Starry flounder sablefish yellowtail barracuda long-finned',
    color: '#34BDC6'
  },
  {
    icon: <TreeIcon width={40} height={40} color="#37E085" />,
    title: 'Environment',
    description: 'Starry flounder sablefish yellowtail barracuda long-finned',
    color: '#37E085'
  },
  {
    icon: <div className="w-10 h-10 flex items-center justify-center text-4xl text-orange-500">🏠</div>,
    title: 'Build and repair',
    description: 'Starry flounder sablefish yellowtail barracuda long-finned',
    color: '#FF8159'
  },
  {
    icon: <div className="w-10 h-10 flex items-center justify-center text-4xl text-yellow-400">💡</div>,
    title: 'Education',
    description: 'Starry flounder sablefish yellowtail barracuda long-finned',
    color: '#FFCE59'
  }
];

const ServicesSection: React.FC = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-2 bg-yellow-400 rounded"></div>
            <p className="text-gray-600">What we do</p>
          </div>

          <h2 className="text-4xl md:text-6xl font-normal leading-tight tracking-tight max-w-2xl">
            Various things we help in whole world
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {services.map((service, index) => (
            <div key={index} className="text-center px-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"
                style={{
                  backgroundColor: `${service.color}20`,
                  border: `2px solid ${service.color}30`
                }}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;