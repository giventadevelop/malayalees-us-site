import { auth } from '@clerk/nextjs';
import { PollList } from '@/components/polls/PollList';
import { fetchUserProfileServer } from '@/app/profile/ApiServerActions';

export default async function PollsPage() {
  // Ensure auth() is properly awaited
  const authResult = await auth();
  const { userId } = authResult;
  
  // Get user profile if logged in
  let userProfile = null;
  if (userId) {
    try {
      userProfile = await fetchUserProfileServer(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto pt-24 pb-12">
        {/* Header Section with Gradient */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-6 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            <p className="text-gray-600 font-medium">Interactive Polls</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight text-gray-900 mb-6">
            Share your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
              voice
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Participate in interactive polls and share your opinions with our community
          </p>
        </div>
        
        <PollList userId={userProfile?.id} />
      </div>
    </div>
  );
}

