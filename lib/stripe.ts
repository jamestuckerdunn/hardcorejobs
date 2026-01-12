import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get subscriptions() { return getStripe().subscriptions; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
  get customers() { return getStripe().customers; },
};

// Price IDs for different products
export const PRICES = {
  FEATURED_JOB: process.env.STRIPE_FEATURED_JOB_PRICE_ID || "",
  RESUME_DATABASE: process.env.STRIPE_RESUME_DB_PRICE_ID || "",
};

// Product metadata
export const PRODUCTS = {
  FEATURED_JOB: {
    name: "Featured Job Posting",
    description: "30-day featured placement for your job listing",
    price: 9900, // $99 in cents
    mode: "payment" as const,
  },
  RESUME_DATABASE: {
    name: "Resume Database Access",
    description: "Monthly access to our resume database",
    price: 19900, // $199 in cents
    mode: "subscription" as const,
  },
};

// Helper to create checkout session for featured job
export async function createFeaturedJobCheckout({
  employerId,
  jobId,
  successUrl,
  cancelUrl,
}: {
  employerId: string;
  jobId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PRICES.FEATURED_JOB,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      employer_id: employerId,
      job_id: jobId || "",
      type: "featured_job",
    },
  });

  return session;
}

// Helper to create checkout session for resume database subscription
export async function createResumeDatabaseCheckout({
  employerId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  employerId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PRICES.RESUME_DATABASE,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      employer_id: employerId,
      type: "resume_subscription",
    },
  };

  // If customer already exists, use their ID
  if (customerId) {
    sessionConfig.customer = customerId;
  }

  const session = await getStripe().checkout.sessions.create(sessionConfig);

  return session;
}

// Helper to cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await getStripe().subscriptions.cancel(subscriptionId);
  return subscription;
}

// Helper to get customer portal URL
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
