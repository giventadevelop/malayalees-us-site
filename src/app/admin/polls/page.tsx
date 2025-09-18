import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { PollManagementClient } from './PollManagementClient';
import { fetchEventPollsServer } from './ApiServerActions';

export default async function PollsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch polls data
  const polls = await fetchEventPollsServer();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Poll Management</h1>
        <p className="text-gray-600 mt-2">
          Create and manage interactive polls for your events
        </p>
      </div>
      
      <PollManagementClient initialPolls={polls} />
    </div>
  );
}

