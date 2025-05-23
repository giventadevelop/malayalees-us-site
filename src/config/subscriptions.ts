export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
  features: Array<string>;
}

export const storeSubscriptionPlans = [
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pro plan with all features',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    price: 9.99,
    features: [
      'Unlimited tasks',
      'Advanced task organization',
      'Priority support',
      'Custom task fields',
      'Team collaboration',
      'Access to dashboard',
      'Premium features',
    ],
  },
  {
    id: "max",
    name: "Max",
    description: "Super Pro tier that offers x, y, and z features.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_MAX_PRICE_ID ?? "",
    price: 3000,
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: "ultra",
    name: "Ultra",
    description: "Ultra Pro tier that offers x, y, and z features.",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ULTRA_PRICE_ID ?? "",
    price: 5000,
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
] as const;
