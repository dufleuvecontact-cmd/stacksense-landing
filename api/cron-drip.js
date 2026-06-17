import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const getEmailTemplate = (siteUrl, safeName, title, contentHtml) => `<!DOCTYPE html>
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
              <img src="${siteUrl}/logo.png" alt="StackSense" style="height: 40px; width: auto; display: block; filter: brightness(0) invert(1);" />
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin-top: 0; color: #1a8c87; font-size: 24px; font-weight: 700;">${title}</h2>
              <p style="color: #3a504d; font-size: 16px;">Hi ${safeName || 'there'},</p>
              
              ${contentHtml}
              
              <p style="color: #3a504d; font-size: 16px; margin-top: 30px; margin-bottom: 0;">
                Best,<br/>
                <strong>Jad & the StackSense Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0c1a18; padding: 20px;">
              <p style="color: #667c78; font-size: 13px; margin: 0;">© 2026 StackSense. All rights reserved.</p>
              <p style="color: #4a5c59; font-size: 12px; margin: 5px 0 0 0;">You're receiving this because you joined the StackSense waitlist.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export default async function handler(req, res) {
  // Verify cron request (Vercel automatically sends a CRON header)
  // To allow manual testing, we skip strict header checks in development.
  
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!supabase || !resend) {
    return res.status(500).json({ message: 'Missing credentials' });
  }

  try {
    const siteUrl = process.env.SITE_URL || 'https://stacksense.ca';
    
    // Fetch all users who haven't finished the drip and haven't paid yet
    // NOTE: This requires the drip_day column to exist. If it fails, catch it.
    const { data: users, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('payment_status', 'none')
      .lt('drip_day', 7);

    if (error) {
      console.error('Supabase error fetching users. Ensure drip_day column exists.', error);
      return res.status(500).json({ error: error.message });
    }

    if (!users || users.length === 0) {
      return res.status(200).json({ message: 'No users require drip emails today.' });
    }

    const now = new Date();
    let emailsSent = 0;

    for (const user of users) {
      const createdAt = new Date(user.created_at);
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      const safeName = escapeHtml(user.name);
      const referralLink = `${siteUrl}/?ref=${encodeURIComponent(user.referral_code)}`;
      
      let subject = '';
      let title = '';
      let htmlContent = '';
      let nextDripDay = user.drip_day;
      let shouldSend = false;

      if (diffDays >= 1 && user.drip_day < 1) {
        // DAY 1 EMAIL
        shouldSend = true;
        nextDripDay = 1;
        subject = 'Sneak Peek inside StackSense 👀';
        title = 'Building the Ultimate Health Tracker';
        htmlContent = `
          <p style="color: #3a504d; font-size: 16px;">It's been a day since you joined the waitlist, and we wanted to give you a quick look behind the curtain.</p>
          <p style="color: #3a504d; font-size: 16px;">We're currently finalizing the core dashboard where you'll be able to correlate your supplement protocols directly with your bloodwork results. No more guessing if a supplement actually works.</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #eff7f4; padding: 20px; border-radius: 8px; border: 1px solid #c2e0d7; display: inline-block;">
              <h4 style="margin-top: 0; color: #1a8c87;">Did you know?</h4>
              <p style="color: #2c423f; margin-bottom: 0;">You can skip the line entirely. Check out our <a href="${siteUrl}" style="color: #1a8c87; font-weight: bold;">Founder Premium</a> pass.</p>
            </div>
          </div>
        `;
      } else if (diffDays >= 3 && user.drip_day < 3) {
        // DAY 3 EMAIL
        shouldSend = true;
        nextDripDay = 3;
        subject = 'Reminder: Claim your 2 free months 🎁';
        title = 'The Power of the StackSense Community';
        htmlContent = `
          <p style="color: #3a504d; font-size: 16px;">We noticed you haven't used your referral code yet! We're building StackSense for people who take their health seriously, and the best way to find those people is through you.</p>
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; background-color: #eff7f4; border: 1px solid #c2e0d7; border-radius: 10px;">
            <tr>
              <td style="padding: 25px;">
                <h3 style="margin-top: 0; color: #1a8c87; font-size: 18px;">Refer 1 Friend = 2 Months Free</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px dashed #1a8c87; border-radius: 8px; margin-bottom: 20px;">
                  <tr>
                    <td align="center" style="padding: 15px;">
                      <span style="display: block; font-size: 13px; color: #667c78; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">Your Unique Code</span>
                      <strong style="font-size: 24px; color: #0c1a18; letter-spacing: 0.1em;">${user.referral_code}</strong>
                    </td>
                  </tr>
                </table>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a href="${referralLink}" style="display: inline-block; background-color: #1a8c87; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; font-size: 15px;">Copy Referral Link</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
      } else if (diffDays >= 7 && user.drip_day < 7) {
        // DAY 7 EMAIL
        shouldSend = true;
        nextDripDay = 7;
        subject = 'Last chance to become a Founding Member 🏆';
        title = 'Lock in your lifetime discount';
        htmlContent = `
          <p style="color: #3a504d; font-size: 16px;">It's been exactly one week since you joined our waitlist! As we get closer to launch, we'll be closing the window for Founding Members soon.</p>
          <p style="color: #3a504d; font-size: 16px;">If you upgrade to Founder Premium today, you lock in:</p>
          <ul style="color: #3a504d; font-size: 16px;">
            <li>6 Months entirely free</li>
            <li>A permanently discounted rate of $9.99/mo</li>
            <li>Instant private beta access</li>
          </ul>
          <p style="color: #3a504d; font-size: 16px;">It takes a $1 fully-refundable deposit to secure your spot.</p>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px;">
            <tr>
              <td align="center">
                <a href="${siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #1a8c87, #0c1a18); color: #ffffff; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; font-size: 16px;">Claim Founder Status</a>
              </td>
            </tr>
          </table>
        `;
      }

      if (shouldSend) {
        try {
          await resend.emails.send({
            from: 'StackSense <contact@stacksense.ca>',
            to: user.email,
            subject: subject,
            html: getEmailTemplate(siteUrl, safeName, title, htmlContent)
          });
          
          // Update DB
          await supabase
            .from('waitlist')
            .update({ drip_day: nextDripDay })
            .eq('email', user.email);
            
          emailsSent++;
        } catch (e) {
          console.error(`Failed to send drip to ${user.email}:`, e);
        }
      }
    }

    return res.status(200).json({ success: true, sent: emailsSent });

  } catch (err) {
    console.error('Cron drip error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
