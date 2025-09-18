import { auth } from '@clerk/nextjs';
import { PollList } from '@/components/polls/PollList';
import { getUserProfileServer } from '@/app/profile/ApiServerActions';

export default async function PollsPage() {
  const { userId } = await auth();
  
  // Get user profile if logged in
  let userProfile = null;
  if (userId) {
    try {
      userProfile = await getUserProfileServer(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Event Polls</h1>
        <p className="text-gray-600 mt-2">
          Participate in interactive polls and share your opinions
        </p>
      </div>
      
      <PollList userId={userProfile?.id} />
    </div>
  );
}

