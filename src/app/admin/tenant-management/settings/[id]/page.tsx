import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { fetchTenantSetting } from '@/app/admin/tenant-management/settings/ApiServerActions';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaBuilding, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { TenantSettingsDTO, TenantOrganizationDTO } from '@/app/admin/tenant-management/types';

interface PageProps {
  params: { id: string };
}

export default async function TenantSettingsViewPage({ params }: PageProps) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const { id } = resolvedParams;
  const settingsId = parseInt(id);

  if (isNaN(settingsId)) {
    notFound();
  }

  // Fetch settings data
  let settings: TenantSettingsDTO | null = null;
  let organization: TenantOrganizationDTO | null = null;
  let error = null;

  try {
    settings = await fetchTenantSetting(settingsId);
    if (!settings) {
      notFound();
    }

    // Use organization data from settings response (already included)
    if (settings.tenantOrganization && settings.tenantOrganization.id) {
      organization = settings.tenantOrganization;
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
    error = err instanceof Error ? err.message : 'Failed to load settings';
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/tenant-management/settings"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading settings
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <Link
                href="/admin/tenant-management/settings"
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Settings
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                Settings Details
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Tenant Settings
              </h1>
              {organization && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {organization.organizationName}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Configuration settings for tenant ID: {settings?.tenantId}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/admin/tenant-management/settings/${id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaEdit />
              Edit Settings
            </Link>
            {organization && (
              <Link
                href={`/admin/tenant-management/organizations/${organization.id}`}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaBuilding />
                View Organization
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tenant ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {settings?.tenantId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organization</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {organization ? (
                      <Link
                        href={`/admin/tenant-management/organizations/${organization.id}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {organization.organizationName}
                      </Link>
                    ) : (
                      'Not found'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User Registration</dt>
                  <dd className="mt-1">
                    {settings?.allowUserRegistration ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaToggleOn className="w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaToggleOff className="w-3 h-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.createdAt
                      ? new Date(settings.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.updatedAt
                      ? new Date(settings.updatedAt).toLocaleDateString()
                      : 'Unknown'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Integration Settings</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">WhatsApp Integration</dt>
                  <dd className="mt-1">
                    {settings?.enableWhatsappIntegration ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaToggleOn className="w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaToggleOff className="w-3 h-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Marketing</dt>
                  <dd className="mt-1">
                    {settings?.enableEmailMarketing ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaToggleOn className="w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaToggleOff className="w-3 h-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Event Management</dt>
                  <dd className="mt-1">
                    {settings?.enableEventManagement ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaToggleOn className="w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaToggleOff className="w-3 h-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Processing</dt>
                  <dd className="mt-1">
                    {settings?.enablePaymentProcessing ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaToggleOn className="w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaToggleOff className="w-3 h-3 mr-1" />
                        Disabled
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Limits and Quotas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Limits and Quotas</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Users</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.maxUsers || 'Unlimited'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Events</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.maxEvents || 'Unlimited'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Storage (GB)</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.maxStorageGB || 'Unlimited'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max API Calls</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {settings?.maxApiCallsPerMonth || 'Unlimited'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Customization */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customization</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Custom CSS</dt>
                  <dd className="mt-1">
                    {settings?.customCss ? (
                      <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                        {settings.customCss}
                      </pre>
                    ) : (
                      <span className="text-sm text-gray-500">No custom CSS</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Custom JavaScript</dt>
                  <dd className="mt-1">
                    {settings?.customJs ? (
                      <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                        {settings.customJs}
                      </pre>
                    ) : (
                      <span className="text-sm text-gray-500">No custom JavaScript</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Provider Config</dt>
                  <dd className="mt-1">
                    {settings?.emailProviderConfig ? (
                      <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(JSON.parse(settings.emailProviderConfig), null, 2)}
                      </pre>
                    ) : (
                      <span className="text-sm text-gray-500">No email provider configuration</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <Link
                href={`/admin/tenant-management/settings/${id}/edit`}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <FaEdit />
                Edit Settings
              </Link>
              {organization && (
                <Link
                  href={`/admin/tenant-management/organizations/${organization.id}`}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
                >
                  <FaBuilding />
                  View Organization
                </Link>
              )}
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Settings Summary</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Active Features</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {[
                      settings?.allowUserRegistration && 'User Registration',
                      settings?.enableWhatsappIntegration && 'WhatsApp',
                      settings?.enableEmailMarketing && 'Email Marketing',
                      settings?.enableEventManagement && 'Event Management',
                      settings?.enablePaymentProcessing && 'Payment Processing'
                    ].filter(Boolean).join(', ') || 'None'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customizations</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {[
                      settings?.customCss && 'Custom CSS',
                      settings?.customJs && 'Custom JS',
                      settings?.emailProviderConfig && 'Email Config'
                    ].filter(Boolean).join(', ') || 'None'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Limits Set</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {[
                      settings?.maxUsers && 'Users',
                      settings?.maxEvents && 'Events',
                      settings?.maxStorageGB && 'Storage',
                      settings?.maxApiCallsPerMonth && 'API Calls'
                    ].filter(Boolean).join(', ') || 'None'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Organization Info */}
          {organization && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Organization</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <Link
                        href={`/admin/tenant-management/organizations/${organization.id}`}
                        className="text-blue-600 hover:text-blue-500"
                      >
                        {organization.organizationName}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${organization.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {organization.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {organization.subscriptionStatus || 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
