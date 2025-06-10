import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from your Stripe dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise; 