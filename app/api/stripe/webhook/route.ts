import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { employer_id, job_id, type } = session.metadata || {};

  if (!employer_id || !type) {
    console.error("Missing metadata in checkout session");
    return;
  }

  if (type === "featured_job" && job_id) {
    // Mark job as featured for 30 days
    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + 30);

    await sql`
      UPDATE jobs
      SET is_featured = true,
          featured_until = ${featuredUntil.toISOString()}
      WHERE id = ${job_id}
    `;

    // Record payment
    await sql`
      INSERT INTO payments (employer_id, stripe_payment_id, type, amount, currency, status, job_id)
      VALUES (${employer_id}, ${session.payment_intent as string}, 'featured_job', ${session.amount_total}, 'usd', 'completed', ${job_id})
    `;
  } else if (type === "resume_subscription") {
    // Update employer with Stripe customer ID and subscription
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    // Set access for 1 month
    const accessUntil = new Date();
    accessUntil.setMonth(accessUntil.getMonth() + 1);

    await sql`
      UPDATE employer_profiles
      SET stripe_customer_id = ${customerId},
          resume_db_subscription_id = ${subscriptionId},
          resume_db_access_until = ${accessUntil.toISOString()}
      WHERE id = ${employer_id}
    `;

    // Record payment
    await sql`
      INSERT INTO payments (employer_id, stripe_subscription_id, type, amount, currency, status)
      VALUES (${employer_id}, ${subscriptionId}, 'resume_subscription', ${session.amount_total}, 'usd', 'completed')
    `;
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find employer by customer ID
  const employers = await sql`
    SELECT id FROM employer_profiles WHERE stripe_customer_id = ${customerId}
  `;

  if (employers.length === 0) return;

  const employerId = employers[0].id;

  if (subscription.status === "active") {
    // Extend access - get current period end from items
    const currentPeriodEnd = subscription.items?.data?.[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days

    await sql`
      UPDATE employer_profiles
      SET resume_db_subscription_id = ${subscription.id},
          resume_db_access_until = ${currentPeriodEnd.toISOString()}
      WHERE id = ${employerId}
    `;
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  await sql`
    UPDATE employer_profiles
    SET resume_db_subscription_id = NULL
    WHERE stripe_customer_id = ${customerId}
  `;
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Get subscription from parent if available
  const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string'
    ? invoice.parent.subscription_details.subscription
    : (invoice.parent?.subscription_details?.subscription as Stripe.Subscription)?.id;

  if (!subscriptionId) return;

  const customerId = invoice.customer as string;

  // Use invoice ID as payment reference
  const paymentRef = invoice.id;

  // Find employer and record payment
  const employers = await sql`
    SELECT id FROM employer_profiles WHERE stripe_customer_id = ${customerId}
  `;

  if (employers.length > 0) {
    await sql`
      INSERT INTO payments (employer_id, stripe_payment_id, stripe_subscription_id, type, amount, currency, status)
      VALUES (${employers[0].id}, ${paymentRef}, ${subscriptionId}, 'resume_subscription', ${invoice.amount_paid}, 'usd', 'completed')
    `;
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Log the failure - in production, you'd want to send an email notification
  console.error(`Payment failed for customer ${customerId}`);

  // Use invoice ID as payment reference
  const paymentRef = invoice.id;

  // Find employer and record failed payment
  const employers = await sql`
    SELECT id FROM employer_profiles WHERE stripe_customer_id = ${customerId}
  `;

  if (employers.length > 0) {
    await sql`
      INSERT INTO payments (employer_id, stripe_payment_id, type, amount, currency, status)
      VALUES (${employers[0].id}, ${paymentRef}, 'resume_subscription', ${invoice.amount_due}, 'usd', 'failed')
    `;
  }
}
