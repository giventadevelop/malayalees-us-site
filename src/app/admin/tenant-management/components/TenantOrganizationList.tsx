'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrashAlt, FaEye, FaToggleOn, FaToggleOff, FaPlus, FaSearch, FaSort } from 'react-icons/fa';
import type { TenantOrganizationDTO, TenantOrganizationFilters, PaginationParams } from '@/app/admin/tenant-management/types';

interface TenantOrganizationListProps {
  initialData?: TenantOrganizationDTO[];
  initialTotalCount?: number;
  onRefresh?: () => void;
}

export default function TenantOrganizationList({
  initialData = [],
  initialTotalCount = 0,
  onRefresh
}: TenantOrganizationListProps) {
  const [organizations, setOrganizations] = useState<TenantOrganizationDTO[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filters, setFilters] = useState<TenantOrganizationFilters>({
    search: '',
    subscriptionStatus: '',
    isActive: undefined,
    sortBy: 'organizationName',
    sortOrder: 'asc'
  });

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Load data function
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/proxy/tenant-organizations?' + new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        ...(filters.search && { 'organizationName.contains': filters.search }),
        ...(filters.subscriptionStatus && { 'subscriptionStatus.equals': filters.subscriptionStatus }),
        ...(filters.isActive !== undefined && { 'isActive.equals': filters.isActive.toString() }),
        ...(filters.sortBy && { sort: `${filters.sortBy},${filters.sortOrder}` })
      }));

      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data = await response.json();
      const total = parseInt(response.headers.get('x-total-count') || '0');

      setOrganizations(Array.isArray(data) ? data : []);
      setTotalCount(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters/pagination change
  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, filters]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(0); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof TenantOrganizationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  // Handle sorting
  const handleSort = (field: 'organizationName' | 'createdAt' | 'subscriptionStatus') => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? organizations.map(org => org.id!).filter(Boolean) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds(prev =>
      checked
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    );
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/proxy/tenant-organizations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        loadData(); // Refresh the list
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      const response = await fetch(`/api/proxy/tenant-organizations/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData(); // Refresh the list
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to delete organization:', err);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPrevPage = currentPage > 0;
  const hasNextPage = currentPage < totalPages - 1;
  const startItem = totalCount > 0 ? currentPage * pageSize + 1 : 0;
  const endItem = currentPage * pageSize + organizations.length;

  if (loading && organizations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tenant Organizations</h2>
        <Link
          href="/admin/tenant-management/organizations/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus />
          Create New
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by organization name or domain..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.subscriptionStatus || ''}
            onChange={(e) => handleFilterChange('subscriptionStatus', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <select
            value={filters.isActive === undefined ? '' : filters.isActive.toString()}
            onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Organizations</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === organizations.length && organizations.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="custom-checkbox"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('organizationName')}
              >
                <div className="flex items-center gap-2">
                  Organization Name
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('subscriptionStatus')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <FaSort className="text-xs" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(org.id!)}
                    onChange={(e) => handleSelectOne(org.id!, e.target.checked)}
                    className="custom-checkbox"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{org.organizationName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{org.domain || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{org.contactEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${org.subscriptionStatus === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : org.subscriptionStatus === 'SUSPENDED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {org.subscriptionStatus || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(org.id!, org.isActive || false)}
                    className={`flex items-center gap-2 ${org.isActive ? 'text-green-600' : 'text-gray-400'
                      }`}
                  >
                    {org.isActive ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                    {org.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/tenant-management/organizations/${org.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/tenant-management/organizations/${org.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(org.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {organizations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No organizations found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <button
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="text-sm font-semibold">
              Page {currentPage + 1} of {totalPages}
            </div>
            <button
              disabled={!hasNextPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            Showing {startItem} to {endItem} of {totalCount} organizations
          </div>
        </div>
      )}
    </div>
  );
}
