import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured.');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || 'https://stacksense.ca');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!stripe) {
    console.error('Stripe client not initialized.');
    return res.status(500).json({ message: 'Payment service temporarily unavailable.' });
  }

  const { email, code } = req.body;

  // Input validation
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (code && (typeof code !== 'string' || code.length > 20 || !/^[A-Z0-9]+$/.test(code))) {
    return res.status(400).json({ message: 'Invalid referral code format.' });
  }

  const priceId = process.env.STRIPE_PRICE_ID || process.env.VITE_STRIPE_PRICE_ID;

  if (!priceId) {
    console.error('STRIPE_PRICE_ID is not configured.');
    return res.status(500).json({ message: 'Payment is temporarily unavailable. Please try again later.' });
  }

  try {
    const siteUrl = process.env.SITE_URL || 'https://stacksense.ca';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      payment_intent_data: {
        description: `StackSense Early Access. Your referral code is: ${code || 'N/A'}`,
        metadata: { referral_code: code || '' },
      },
      metadata: { referral_code: code || '' },
      success_url: `${siteUrl}/?payment=success${code ? `&code=${encodeURIComponent(code)}` : ''}`,
      cancel_url: `${siteUrl}/?payment=cancel`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'An error occurred while setting up payment. Please try again later.' });
  }
}
