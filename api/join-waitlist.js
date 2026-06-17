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
        from: 'StackSense <contact@stacksense.ca>',
        to: email,
        subject: 'You\'re on the list! (+ How to get 2 free months)',
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
              <h2 style="margin-top: 0; color: #1a8c87; font-size: 24px; font-weight: 700;">You're on the list! 🎉</h2>
              
              <p style="color: #3a504d; font-size: 16px;">Hi \${safeName || 'there'},</p>
              
              <p style="color: #3a504d; font-size: 16px;">We are so glad you joined us and we really appreciate your interest in StackSense! You have successfully joined the waitlist and your spot is securely saved.</p>
              
              <!-- Referral Section -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 35px 0; background-color: #eff7f4; border: 1px solid #c2e0d7; border-radius: 10px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin-top: 0; color: #1a8c87; font-size: 18px;">Want 2 free months of StackSense Unlimited?</h3>
                    <p style="color: #2c423f; font-size: 15px; margin-bottom: 20px;">We're prioritizing users who help us spread the word. We'd love it if you invited people to join us. If you refer just <strong>1 person</strong> using your unique referral code or link below, you'll automatically get 2 months free when we launch.</p>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px dashed #1a8c87; border-radius: 8px; margin-bottom: 20px;">
                      <tr>
                        <td align="center" style="padding: 15px;">
                          <span style="display: block; font-size: 13px; color: #667c78; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">Your Unique Code</span>
                          <strong style="font-size: 24px; color: #0c1a18; letter-spacing: 0.1em;">\${newCode}</strong>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="\${referralLink}" style="display: inline-block; background-color: #1a8c87; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; font-size: 15px;">Share Your Referral Link</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="color: #3a504d; font-size: 16px;">Just share this code or link with a friend or in your community. When they join the waitlist using it, we'll track the referral to your account.</p>
              
              <p style="color: #3a504d; font-size: 16px; margin-top: 30px;">Stay tuned for early access updates!</p>
              
              <p style="color: #3a504d; font-size: 16px; margin-bottom: 0;">
                Best,<br/>
                <strong>Jad & the StackSense Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0c1a18; padding: 20px;">
              <p style="color: #667c78; font-size: 13px; margin: 0;">© 2026 StackSense. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
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
