import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;

    if (email) {
      // Update payment_status in Supabase
      const { error } = await supabase
        .from('waitlist')
        .update({ payment_status: 'paid' })
        .eq('email', email);

      if (error) {
        console.error('Error updating payment status in Supabase:', error);
      } else {
        console.log(`Updated payment_status to paid for ${email}`);
      }

      // Send Confirmation/Receipt Email
      if (resend) {
        try {
          await resend.emails.send({
            from: 'StackSense <founders@stacksense.ca>',
            to: email,
            subject: 'StackSense Founding Member Receipt & Confirmation',
            html: `
              <p>Hi there,</p>
              <p>Thank you for becoming a Founding Member of StackSense!</p>
              <p>Your payment was successful and your $9.99/mo rate (along with your 6 free months) is locked in. We will reach out when the app is ready for you to log in.</p>
              <p>As a reminder, your deposit is <strong>100% fully refundable at any time</strong> before launch. Just reply to this email.</p>
              <p>Please keep this email as your receipt.</p>
              <p>Best,<br/>Jad & the StackSense Team</p>
            `,
          });
          console.log(`Sent receipt email to ${email}`);
        } catch (err) {
          console.error('Error sending receipt email:', err);
        }
      } else {
        console.warn('RESEND_API_KEY not configured. Receipt email skipped.');
      }
    }
  }

  res.status(200).json({ received: true });
}
