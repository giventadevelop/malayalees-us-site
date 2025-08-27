import { createProxyHandler } from '@/lib/proxyHandler';

export default createProxyHandler({ backendPath: '/api/executive-committee-team-members' });

export const config = {
  api: {
    bodyParser: false,
  },
};

