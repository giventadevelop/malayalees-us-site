import { auth, currentUser } from '@clerk/nextjs/server';
import { fetchAdminProfileServer } from './ApiServerActions';
import ManageUsageClient from './ManageUsageClient';
import { bootstrapUserProfile } from '@/components/ProfileBootstrapperApiServerActions';

export default async function ManageUsagePage() {
  // Fix for Next.js 15+: await auth() before using
  const { userId } = await auth();
  let adminProfile = null;
  if (userId) {
    // Ensure tenant-scoped profile exists for the current admin user
    try {
      const u = await currentUser();
      await bootstrapUserProfile({ userId, user: u });
    } catch { }
    adminProfile = await fetchAdminProfileServer(userId);
  }
  // Note: We are not fetching all users here anymore to keep it simple.
  // The ManageUsageClient will need to handle fetching users if required.
  return <ManageUsageClient adminProfile={adminProfile} />;
}