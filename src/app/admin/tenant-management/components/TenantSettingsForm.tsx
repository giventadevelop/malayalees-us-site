'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaSave, FaBan, FaCode, FaCog } from 'react-icons/fa';
import type { TenantSettingsDTO, TenantSettingsFormDTO, TenantOrganizationDTO } from '@/app/admin/tenant-management/types';

interface TenantSettingsFormProps {
  initialData?: TenantSettingsDTO;
  onSubmit: (data: TenantSettingsFormDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
  availableOrganizations?: TenantOrganizationDTO[];
}

export default function TenantSettingsForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode,
  availableOrganizations = []
}: TenantSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'limits' | 'customization'>('general');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<TenantSettingsFormDTO>({
    defaultValues: {
      tenantId: initialData?.tenantId || '',
      allowUserRegistration: initialData?.allowUserRegistration ?? true,
      requireAdminApproval: initialData?.requireAdminApproval ?? false,
      enableWhatsappIntegration: initialData?.enableWhatsappIntegration ?? false,
      enableEmailMarketing: initialData?.enableEmailMarketing ?? false,
      whatsappApiKey: initialData?.whatsappApiKey || '',
      emailProviderConfig: initialData?.emailProviderConfig || '',
      maxEventsPerMonth: initialData?.maxEventsPerMonth || undefined,
      maxAttendeesPerEvent: initialData?.maxAttendeesPerEvent || undefined,
      enableGuestRegistration: initialData?.enableGuestRegistration ?? true,
      maxGuestsPerAttendee: initialData?.maxGuestsPerAttendee || 5,
      defaultEventCapacity: initialData?.defaultEventCapacity || 100,
      platformFeePercentage: initialData?.platformFeePercentage || undefined,
      customCss: initialData?.customCss || '',
      customJs: initialData?.customJs || ''
    }
  });

  // Watch form values for real-time updates
  const watchedValues = watch();

  // Handle form submission
  const onFormSubmit = async (data: TenantSettingsFormDTO) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Toggle switch component
  const ToggleSwitch = ({
    name,
    label,
    description,
    checked,
    onChange
  }: {
    name: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  // Tab navigation
  const tabs = [
    { id: 'general', label: 'General', icon: FaCog },
    { id: 'integrations', label: 'Integrations', icon: FaCode },
    { id: 'limits', label: 'Limits', icon: FaCog },
    { id: 'customization', label: 'Customization', icon: FaCode }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>

            {/* Tenant Selection (for create mode) */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant Organization *
                </label>
                <select
                  {...register('tenantId', { required: 'Please select a tenant organization' })}
                  className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                >
                  <option value="">Select Tenant Organization</option>
                  {availableOrganizations.map((org) => (
                    <option key={org.id} value={org.tenantId}>
                      {org.organizationName} ({org.tenantId})
                    </option>
                  ))}
                </select>
                {errors.tenantId && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
                )}
              </div>
            )}

            {/* User Registration Settings */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">User Registration</h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <ToggleSwitch
                  name="allowUserRegistration"
                  label="Allow User Registration"
                  description="Enable users to register themselves on the platform"
                  checked={watchedValues.allowUserRegistration || false}
                  onChange={(checked) => setValue('allowUserRegistration', checked)}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <ToggleSwitch
                  name="requireAdminApproval"
                  label="Require Admin Approval"
                  description="New user registrations must be approved by an admin"
                  checked={watchedValues.requireAdminApproval || false}
                  onChange={(checked) => setValue('requireAdminApproval', checked)}
                />
              </div>
            </div>

            {/* Guest Registration Settings */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Guest Registration</h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <ToggleSwitch
                  name="enableGuestRegistration"
                  label="Enable Guest Registration"
                  description="Allow attendees to bring guests to events"
                  checked={watchedValues.enableGuestRegistration || false}
                  onChange={(checked) => setValue('enableGuestRegistration', checked)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests Per Attendee
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  {...register('maxGuestsPerAttendee', {
                    min: { value: 0, message: 'Must be at least 0' },
                    max: { value: 20, message: 'Must be at most 20' }
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                />
                {errors.maxGuestsPerAttendee && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxGuestsPerAttendee.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Integration Settings</h3>

            {/* WhatsApp Integration */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">WhatsApp Integration</h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <ToggleSwitch
                  name="enableWhatsappIntegration"
                  label="Enable WhatsApp Integration"
                  description="Allow sending notifications via WhatsApp"
                  checked={watchedValues.enableWhatsappIntegration || false}
                  onChange={(checked) => setValue('enableWhatsappIntegration', checked)}
                />
              </div>

              {watchedValues.enableWhatsappIntegration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp API Key
                  </label>
                  <input
                    type="password"
                    {...register('whatsappApiKey', {
                      maxLength: {
                        value: 500,
                        message: 'API key must be less than 500 characters'
                      }
                    })}
                    className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                    placeholder="Enter your WhatsApp API key"
                  />
                  {errors.whatsappApiKey && (
                    <p className="mt-1 text-sm text-red-600">{errors.whatsappApiKey.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Email Marketing Integration */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Email Marketing</h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <ToggleSwitch
                  name="enableEmailMarketing"
                  label="Enable Email Marketing"
                  description="Allow sending promotional emails to users"
                  checked={watchedValues.enableEmailMarketing || false}
                  onChange={(checked) => setValue('enableEmailMarketing', checked)}
                />
              </div>

              {watchedValues.enableEmailMarketing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Provider Configuration (JSON)
                  </label>
                  <textarea
                    {...register('emailProviderConfig', {
                      maxLength: {
                        value: 2048,
                        message: 'Configuration must be less than 2048 characters'
                      }
                    })}
                    rows={6}
                    className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base font-mono text-sm"
                    placeholder='{"provider": "sendgrid", "apiKey": "your-api-key", "fromEmail": "noreply@example.com"}'
                  />
                  {errors.emailProviderConfig && (
                    <p className="mt-1 text-sm text-red-600">{errors.emailProviderConfig.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Limits Tab */}
        {activeTab === 'limits' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Usage Limits</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Events Per Month
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('maxEventsPerMonth', {
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                  placeholder="Unlimited if empty"
                />
                {errors.maxEventsPerMonth && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxEventsPerMonth.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Leave empty for unlimited events</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attendees Per Event
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('maxAttendeesPerEvent', {
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                  placeholder="Unlimited if empty"
                />
                {errors.maxAttendeesPerEvent && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAttendeesPerEvent.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Leave empty for unlimited attendees</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Event Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('defaultEventCapacity', {
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base"
                  placeholder="100"
                />
                {errors.defaultEventCapacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.defaultEventCapacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Fee Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    max="100"
                    {...register('platformFeePercentage', {
                      min: { value: 0, message: 'Must be at least 0%' },
                      max: { value: 100, message: 'Must be at most 100%' }
                    })}
                    className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base pr-8"
                    placeholder="0.0000"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors.platformFeePercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.platformFeePercentage.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Platform fee as a percentage (e.g., 2.5 for 2.5%)</p>
              </div>
            </div>
          </div>
        )}

        {/* Customization Tab */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Custom Styling</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <textarea
                {...register('customCss', {
                  maxLength: {
                    value: 8192,
                    message: 'CSS must be less than 8192 characters'
                  }
                })}
                rows={12}
                className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
              />
              {errors.customCss && (
                <p className="mt-1 text-sm text-red-600">{errors.customCss.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Custom CSS will be applied to all pages. Use with caution.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom JavaScript
              </label>
              <textarea
                {...register('customJs', {
                  maxLength: {
                    value: 16384,
                    message: 'JavaScript must be less than 16384 characters'
                  }
                })}
                rows={12}
                className="mt-1 block w-full border border-gray-400 rounded-xl focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-base font-mono text-sm"
                placeholder="// Add your custom JavaScript here"
              />
              {errors.customJs && (
                <p className="mt-1 text-sm text-red-600">{errors.customJs.message}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Custom JavaScript will be loaded on all pages. Use with extreme caution.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaBan />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            {isSubmitting || loading ? 'Saving...' : mode === 'create' ? 'Create Settings' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
