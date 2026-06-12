import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pjapdxatvghedkbxtnzo.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXBkeGF0dmdoZWRrYnh0bnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwNzAsImV4cCI6MjA5MDkyNzA3MH0.1Zp5S-qVWMTNcjTOZ4Vmq71BqVq7DTO-75e3n4RX95k';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name, refCode, newCode } = req.body;

  try {
    // 1. Check if referral code is valid
    if (refCode) {
      const { data, error } = await supabase.from('waitlist').select('referral_code').eq('referral_code', refCode).maybeSingle();
      if (error || !data) {
        return res.status(400).json({ code: 'INVALID_REF', message: 'The referral code you entered is invalid.' });
      }
    }

    // 2. Insert into Waitlist
    const { error: insertError } = await supabase.from('waitlist').insert([{
      email,
      name: name || null,
      referred_by: refCode || null,
      referral_code: newCode,
      payment_status: 'none',
    }]);

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ code: 'DUPLICATE', message: "You're already on the waitlist! Check your email or contact support@stacksense.ca." });
      }
      throw insertError;
    }

    // 3. Send Referral Email
    const siteUrl = process.env.SITE_URL || 'https://stacksense.ca';
    const referralLink = `${siteUrl}/?ref=${newCode}`;

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'StackSense <founders@stacksense.ca>',
        to: email,
        subject: 'You\'re on the list! (+ How to get 2 free months)',
        html: `
          <p>Hi ${name ? name : 'there'},</p>
          <p>Thanks for joining the StackSense waitlist! Your spot is securely saved.</p>
          <p><strong>Want 2 months of StackSense Unlimited for free?</strong></p>
          <p>We're prioritizing users who help us spread the word. If you refer just <strong>1 person</strong> using your unique link below, you'll automatically get 2 months free when we launch.</p>
          <p><strong>Your unique referral link:</strong><br/>
          <a href="${referralLink}">${referralLink}</a></p>
          <p>Just share this link with a friend or in your community. When they join the waitlist, we'll track the referral to your account.</p>
          <p>Stay tuned for early access updates.</p>
          <p>Best,<br/>Jad & the StackSense Team</p>
        `,
      });
    } else {
      console.log('RESEND_API_KEY not configured. Email skipped.');
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
