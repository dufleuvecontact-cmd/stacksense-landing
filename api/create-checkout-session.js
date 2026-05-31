import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // or latest
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, code } = req.body;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    return res.status(500).json({ message: 'STRIPE_PRICE_ID is not configured on the server.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email, // Prefill user email
      payment_intent_data: {
        description: `StackSense Early Access. Your referral code is: ${code}`,
        metadata: { referral_code: code },
      },
      metadata: { referral_code: code },
      success_url: `${req.headers.origin}/?payment=success${code ? `&code=${code}` : ''}#waitlist`,
      cancel_url: `${req.headers.origin}/?payment=cancel#waitlist`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
