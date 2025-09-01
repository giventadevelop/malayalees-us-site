import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProfilePageWithLoading from '@/components/ProfilePageWithLoading';

export default async function ProfilePage() {
  // Fix for Next.js 15+: await auth() before using
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Use client component that handles loading state
  return <ProfilePageWithLoading />;
}