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
          const siteUrl = process.env.SITE_URL || 'https://stacksense.ca';
          const name = session.customer_details?.name || '';
          const safeName = name ? name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : '';
          
          await resend.emails.send({
            from: 'StackSense <contact@stacksense.ca>',
            to: email,
            subject: 'StackSense Founding Member Receipt & Confirmation',
            html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f7f6; padding: 20px; margin: 0; color: #0c1a18; line-height: 1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #dce8e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          
          <!-- Colored Header Bar -->
          <tr>
            <td align="center" style="background-color: #0c1a18; padding: 30px 20px;">
              <img src="\${siteUrl}/logo.png" alt="StackSense" style="height: 40px; width: auto; display: block; filter: brightness(0) invert(1);" />
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin-top: 0; color: #1a8c87; font-size: 24px; font-weight: 700;">Welcome to the Founding Team! 🚀</h2>
              
              <p style="color: #3a504d; font-size: 16px;">Hi \${safeName || 'there'},</p>
              
              <p style="color: #3a504d; font-size: 16px;">Thank you so much for becoming a Founding Member of StackSense. Your support means everything to us at this early stage.</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; background-color: #eff7f4; border: 1px solid #c2e0d7; border-radius: 10px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin-top: 0; color: #1a8c87; font-size: 18px;">Your Founder Benefits are Locked In</h3>
                    <ul style="color: #2c423f; font-size: 15px; margin: 0; padding-left: 20px;">
                      <li style="margin-bottom: 10px;"><strong>6 Months Free</strong> of StackSense Unlimited at launch</li>
                      <li style="margin-bottom: 10px;">Lifetime locked-in rate of <strong>$9.99/mo</strong> (normally $19.99)</li>
                      <li style="margin-bottom: 10px;">VIP access to our private beta</li>
                      <li style="margin-bottom: 0;">Direct feedback line to the founders</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="color: #3a504d; font-size: 16px;">Your $1 deposit payment was successful. We will reach out the moment the app is ready for you to log in.</p>
              
              <p style="color: #3a504d; font-size: 16px;">As a reminder, your deposit is <strong>100% fully refundable at any time</strong> before launch. If you change your mind, just reply to this email.</p>
              
              <p style="color: #3a504d; font-size: 16px; margin-top: 30px; margin-bottom: 0;">
                Best,<br/>
                <strong>Jad & the StackSense Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0c1a18; padding: 20px;">
              <p style="color: #667c78; font-size: 13px; margin: 0;">© 2026 StackSense. Please keep this email as your receipt.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
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
