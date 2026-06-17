import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || 'https://stacksense.ca');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!supabase) {
    console.error('Supabase client not initialized.');
    return res.status(500).json({ message: 'Service temporarily unavailable.' });
  }

  const { email, name, refCode } = req.body;

  // Server-side input validation
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (email.length > 254) {
    return res.status(400).json({ message: 'Email address is too long.' });
  }
  if (name && (typeof name !== 'string' || name.length > 100 || !/^[A-Za-z\s\-']+$/.test(name))) {
    return res.status(400).json({ message: 'Please enter a valid name (letters, spaces, hyphens only, max 100 characters).' });
  }
  if (refCode && (typeof refCode !== 'string' || refCode.length > 20 || !/^[A-Z0-9]+$/.test(refCode))) {
    return res.status(400).json({ message: 'Invalid referral code format.' });
  }

  // Generate referral code server-side (cryptographically secure)
  const newCode = crypto.randomBytes(4).toString('hex').toUpperCase();

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
    const referralLink = `${siteUrl}/?ref=${encodeURIComponent(newCode)}`;
    const safeName = escapeHtml(name);

    if (resend) {
      await resend.emails.send({
        from: 'StackSense <founders@stacksense.ca>',
        to: email,
        subject: 'You\'re on the list! (+ How to get 2 free months)',
        html: `
          <p>Hi ${safeName || 'there'},</p>
          <p>We are so glad you joined us and we really appreciate your interest in our business!</p>
          <p>You have successfully joined the StackSense waitlist. Your spot is securely saved.</p>
          <p><strong>Want to earn rewards like 2 months of StackSense Unlimited for free?</strong></p>
          <p>We're prioritizing users who help us spread the word. We'd love it if you invited people to join us. If you refer just <strong>1 person</strong> using your unique referral code or link below, you'll automatically get 2 months free when we launch.</p>
          <p><strong>Your unique referral code:</strong> ${newCode}</p>
          <p><strong>Your unique referral link:</strong><br/>
          <a href="${referralLink}">${referralLink}</a></p>
          <p>Just share this code or link with a friend or in your community. When they join the waitlist using it, we'll track the referral to your account.</p>
          <p>Stay tuned for early access updates!</p>
          <p>Best,<br/>Jad & the StackSense Team</p>
        `,
      });
    } else {
      console.log('RESEND_API_KEY not configured. Email skipped.');
    }

    res.status(200).json({ success: true, code: newCode });
  } catch (err) {
    console.error('Waitlist error:', err);
    res.status(500).json({ message: 'An internal error occurred. Please try again later.' });
  }
}
