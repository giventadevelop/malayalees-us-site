import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { fetchTenantSetting, updateTenantSetting } from '@/app/admin/tenant-management/settings/ApiServerActions';
import { fetchTenantOrganizations } from '@/app/admin/tenant-management/organizations/ApiServerActions';
import TenantSettingsForm from '@/app/admin/tenant-management/components/TenantSettingsForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { TenantSettingsFormDTO } from '@/app/admin/tenant-management/types';

interface PageProps {
  params: { id: string };
}

export default async function EditTenantSettingsPage({ params }: PageProps) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const { id } = resolvedParams;
  const settingsId = parseInt(id);

  if (isNaN(settingsId)) {
    notFound();
  }

  // Fetch settings data
  let settings = null;
  let organizations = [];
  let error = null;

  try {
    settings = await fetchTenantSetting(settingsId);
    if (!settings) {
      notFound();
    }

    // Fetch organizations for dropdown
    try {
      const result = await fetchTenantOrganizations({ page: 0, pageSize: 100 }, {});
      organizations = result.data;
    } catch (orgError) {
      console.error('Error fetching organizations:', orgError);
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
    error = err instanceof Error ? err.message : 'Failed to load settings';
  }

  async function handleSubmit(data: TenantSettingsFormDTO) {
    'use server';

    try {
      await updateTenantSetting(settingsId, data);
      redirect(`/admin/tenant-management/settings/${settingsId}`);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                href={`/admin/tenant-management/settings/${id}`}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Settings Details
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
                Edit
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update tenant configuration settings
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Settings Configuration</h2>
        </div>
        <div className="px-6 py-6">
          <TenantSettingsForm
            mode="edit"
            onSubmit={handleSubmit}
            organizations={organizations}
            initialData={{
              tenantId: settings?.tenantId || '',
              allowUserRegistration: settings?.allowUserRegistration ?? true,
              enableWhatsappIntegration: settings?.enableWhatsappIntegration ?? false,
              enableEmailMarketing: settings?.enableEmailMarketing ?? false,
              enableEventManagement: settings?.enableEventManagement ?? true,
              enablePaymentProcessing: settings?.enablePaymentProcessing ?? false,
              maxUsers: settings?.maxUsers || null,
              maxEvents: settings?.maxEvents || null,
              maxStorageGB: settings?.maxStorageGB || null,
              maxApiCallsPerMonth: settings?.maxApiCallsPerMonth || null,
              customCss: settings?.customCss || '',
              customJs: settings?.customJs || '',
              emailProviderConfig: settings?.emailProviderConfig || '{}'
            }}
          />
        </div>
      </div>
    </div>
  );
}