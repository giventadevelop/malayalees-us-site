'use client';

import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaEnvelope, FaCreditCard, FaHome, FaUserTie, FaChartLine, FaBuilding, FaCog, FaMicrophone, FaPhone, FaHandshake, FaMailBulk, FaUserCheck } from 'react-icons/fa';

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
      href: '/admin/manage-events',
      icon: FaCalendarAlt,
      label: 'Manage Events',
      color: 'green',
      active: currentPage === 'manage-events',
      key: 'manage-events'
    },
    {
      href: '/admin/events',
      icon: FaChartLine,
      label: 'Event Analytics',
      color: 'teal',
      active: currentPage === 'events',
      key: 'event-analytics'
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
    },
    {
      href: '/admin/tenant-management/organizations',
      icon: FaBuilding,
      label: 'Organizations',
      color: 'cyan',
      active: currentPage === 'tenant-organizations',
      key: 'tenant-organizations'
    },
    {
      href: '/admin/tenant-management/settings',
      icon: FaCog,
      label: 'Tenant Settings',
      color: 'slate',
      active: currentPage === 'tenant-settings',
      key: 'tenant-settings'
    },
    {
      href: '/admin/tenant-management/test',
      icon: FaChartLine,
      label: 'Test CRUD',
      color: 'red',
      active: currentPage === 'tenant-test',
      key: 'tenant-test'
    },
    // Global Event Management Features
    {
      href: '/admin/event-featured-performers',
      icon: FaMicrophone,
      label: 'Global Performers',
      color: 'pink',
      active: currentPage === 'event-featured-performers',
      key: 'global-performers'
    },
    {
      href: '/admin/event-contacts',
      icon: FaPhone,
      label: 'Global Contacts',
      color: 'emerald',
      active: currentPage === 'event-contacts',
      key: 'global-contacts'
    },
    {
      href: '/admin/event-sponsors',
      icon: FaHandshake,
      label: 'Global Sponsors',
      color: 'amber',
      active: currentPage === 'event-sponsors',
      key: 'global-sponsors'
    },
    {
      href: '/admin/event-emails',
      icon: FaMailBulk,
      label: 'Global Emails',
      color: 'cyan',
      active: currentPage === 'event-emails',
      key: 'global-emails'
    },
    {
      href: '/admin/event-program-directors',
      icon: FaUserCheck,
      label: 'Global Directors',
      color: 'indigo',
      active: currentPage === 'event-program-directors',
      key: 'global-directors'
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
      indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700',
      cyan: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700',
      slate: 'bg-slate-50 hover:bg-slate-100 text-slate-700',
      red: 'bg-red-50 hover:bg-red-100 text-red-700',
      pink: 'bg-pink-50 hover:bg-pink-100 text-pink-700',
      emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-50 hover:bg-amber-100 text-amber-700'
    };

    const activeColors = {
      gray: 'bg-gray-200 text-gray-800',
      blue: 'bg-blue-200 text-blue-800',
      green: 'bg-green-200 text-green-800',
      yellow: 'bg-yellow-200 text-yellow-800',
      purple: 'bg-purple-200 text-purple-800',
      orange: 'bg-orange-200 text-orange-800',
      teal: 'bg-teal-200 text-teal-800',
      indigo: 'bg-indigo-200 text-indigo-800',
      cyan: 'bg-cyan-200 text-cyan-800',
      slate: 'bg-slate-200 text-slate-800',
      red: 'bg-red-200 text-red-800',
      pink: 'bg-pink-200 text-pink-800',
      emerald: 'bg-emerald-200 text-emerald-800',
      amber: 'bg-amber-200 text-amber-800'
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
