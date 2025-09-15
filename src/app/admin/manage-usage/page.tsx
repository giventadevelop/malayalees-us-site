import { auth } from '@clerk/nextjs/server';
import { fetchAdminProfileServer } from './ApiServerActions';
import ManageUsageClient from './ManageUsageClient';

export default async function ManageUsagePage() {
  // Fix for Next.js 15+: await auth() before using
  const { userId } = await auth();
  const adminProfile = userId ? await fetchAdminProfileServer(userId) : null;
  // Note: We are not fetching all users here anymore to keep it simple.
  // The ManageUsageClient will need to handle fetching users if required.
  return <ManageUsageClient adminProfile={adminProfile} />;
}