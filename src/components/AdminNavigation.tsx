'use client';

import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaEnvelope, FaCreditCard, FaHome, FaUserTie, FaChartLine } from 'react-icons/fa';

interface AdminNavigationProps {
  currentPage?: string;
  showHome?: boolean;
}

export default function AdminNavigation({ currentPage, showHome = true }: AdminNavigationProps) {
  const buttons = [
    ...(showHome ? [{
      href: '/admin',
      icon: FaHome,
      label: 'Admin Home',
      color: 'gray',
      active: currentPage === 'admin',
      key: 'admin-home'
    }] : []),
    {
      href: '/admin/manage-usage',
      icon: FaUsers,
      label: 'Manage Users',
      color: 'blue',
      active: currentPage === 'manage-usage',
      key: 'manage-usage'
    },
    {
      href: '/admin/events',
      icon: FaCalendarAlt,
      label: 'Manage Events',
      color: 'green',
      active: currentPage === 'events',
      key: 'manage-events'
    },
    {
      href: '/admin/events/dashboard',
      icon: FaChartLine,
      label: 'Event Analytics',
      color: 'teal',
      active: currentPage === 'event-dashboard',
      key: 'event-dashboard'
    },
    {
      href: '/admin/events/registrations',
      icon: FaUsers,
      label: 'Registrations',
      color: 'indigo',
      active: currentPage === 'event-registrations',
      key: 'event-registrations'
    },
    {
      href: '/admin/promotion-emails',
      icon: FaEnvelope,
      label: 'Promotion Emails',
      color: 'yellow',
      active: currentPage === 'promotion-emails',
      key: 'promotion-emails'
    },
    {
      href: '/admin/test-stripe',
      icon: FaCreditCard,
      label: 'Test Stripe',
      color: 'purple',
      active: currentPage === 'test-stripe',
      key: 'test-stripe'
    },
    {
      href: '/admin/executive-committee',
      icon: FaUserTie,
      label: 'Exec Team Members',
      color: 'orange',
      active: currentPage === 'executive-committee',
      key: 'executive-committee'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseColors = {
      gray: 'bg-gray-50 hover:bg-gray-100 text-gray-700',
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      green: 'bg-green-50 hover:bg-green-100 text-green-700',
      yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
      orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
      teal: 'bg-teal-50 hover:bg-teal-100 text-teal-700',
      indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
    };

    const activeColors = {
      gray: 'bg-gray-200 text-gray-800',
      blue: 'bg-blue-200 text-blue-800',
      green: 'bg-green-200 text-green-800',
      yellow: 'bg-yellow-200 text-yellow-800',
      purple: 'bg-purple-200 text-purple-800',
      orange: 'bg-orange-200 text-orange-800',
      teal: 'bg-teal-200 text-teal-800',
      indigo: 'bg-indigo-200 text-indigo-800'
    };

    return isActive ? activeColors[color as keyof typeof activeColors] : baseColors[color as keyof typeof baseColors];
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 justify-items-center mx-auto">
          {buttons.map((button) => {
            const IconComponent = button.icon;
            const colorClasses = getColorClasses(button.color, button.active);

            return (
              <Link
                key={button.key}
                href={button.href}
                className={`w-40 max-w-xs mx-auto flex flex-col items-center justify-center rounded-md shadow p-2 text-xs transition-all cursor-pointer ${colorClasses}`}
              >
                <IconComponent className="text-base sm:text-lg mb-1 mx-auto" />
                <span className="font-semibold text-center leading-tight">{button.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
