'use client';

import React, { useEffect, useState } from 'react';
import { TenantSettingsDTO } from '@/types';
import { getAppUrl } from '@/lib/env';

interface TenantSettingsContextType {
  settings: TenantSettingsDTO | null;
  loading: boolean;
  showEventsSection: boolean;
  showTeamSection: boolean;
  showSponsorsSection: boolean;
}

const TenantSettingsContext = React.createContext<TenantSettingsContextType>({
  settings: null,
  loading: true,
  showEventsSection: true, // Default to true for backward compatibility
  showTeamSection: true,
  showSponsorsSection: true,
});

export const useTenantSettings = () => React.useContext(TenantSettingsContext);

interface TenantSettingsProviderProps {
  children: React.ReactNode;
}

export const TenantSettingsProvider: React.FC<TenantSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<TenantSettingsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache key for sessionStorage
  const CACHE_KEY = 'homepage_tenant_settings_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    async function fetchTenantSettings() {
      // Check cache first
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('✅ Using cached tenant settings data');
            setSettings(data);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to read tenant settings cache:', error);
      }

      try {
        const baseUrl = getAppUrl();
        const response = await fetch(
          `${baseUrl}/api/proxy/tenant-settings`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        );

        if (response.ok) {
          const data = await response.json();
          const tenantSettings = Array.isArray(data) ? data[0] : data;

          if (tenantSettings) {
            console.log('✅ Tenant settings fetched successfully:', {
              tenantId: tenantSettings.tenantId,
              showEvents: tenantSettings.showEventsSectionInHomePage,
              showTeam: tenantSettings.showTeamMembersSectionInHomePage,
              showSponsors: tenantSettings.showSponsorsSectionInHomePage
            });

            setSettings(tenantSettings);

            // Cache the result
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                data: tenantSettings,
                timestamp: Date.now()
              }));
            } catch (error) {
              console.warn('Failed to cache tenant settings:', error);
            }
          } else {
            console.warn('⚠️ No tenant settings found, using defaults');
            setSettings(null);
          }
        } else {
          console.error('❌ Failed to fetch tenant settings:', response.status);
          setSettings(null);
        }
      } catch (error) {
        console.error('❌ Error fetching tenant settings:', error);
        setSettings(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTenantSettings();
  }, [CACHE_KEY, CACHE_DURATION]);

  // Determine section visibility with fallback to true (show by default)
  const showEventsSection = settings?.showEventsSectionInHomePage ?? true;
  const showTeamSection = settings?.showTeamMembersSectionInHomePage ?? true;
  const showSponsorsSection = settings?.showSponsorsSectionInHomePage ?? true;

  const contextValue: TenantSettingsContextType = {
    settings,
    loading,
    showEventsSection,
    showTeamSection,
    showSponsorsSection,
  };

  return (
    <TenantSettingsContext.Provider value={contextValue}>
      {children}
    </TenantSettingsContext.Provider>
  );
};

