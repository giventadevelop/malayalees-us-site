import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ExecutiveCommitteeClient from './ExecutiveCommitteeClient';
import { fetchExecutiveCommitteeMembers } from './ApiServerActions';

export default async function ExecutiveCommitteePage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  let members = [];
  try {
    members = await fetchExecutiveCommitteeMembers();
  } catch (error) {
    console.error('Failed to fetch executive committee members:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Executive Committee Management
        </h1>
        <p className="text-gray-600">
          Manage executive committee team members, their profiles, and roles.
        </p>
      </div>

      <ExecutiveCommitteeClient initialMembers={members} />
    </div>
  );
}

