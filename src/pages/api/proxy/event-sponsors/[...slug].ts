import { createProxyHandler } from '@/lib/proxyHandler';

export default createProxyHandler({ backendPath: '/api/event-sponsors' });

export const config = {
  api: {
    bodyParser: false,
  },
};
