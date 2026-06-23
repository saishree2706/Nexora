import { Resend } from 'resend';

export const prerender = false;

/**
 * Permissive email regex — rejects blatantly malformed strings while
 * accepting real-world TLDs. Authoritative validation happens at the
 * Resend API boundary.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_FIELD = 5000;

function sanitize(raw) {
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, MAX_FIELD);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function readEnv(name) {
  // Astro/Vite exposes .env values via import.meta.env at build/dev time.
  // process.env is the fallback for production Node deployments where the
  // host (PM2, systemd, Docker, etc.) injects vars directly into the process.
  const v = import.meta.env[name] ?? process.env[name];
  return v == null ? '' : String(v);
}

function requireEnv(name) {
  const v = readEnv(name);
  if (!v.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v.trim();
}

let cachedClient = null;
function getClient() {
  if (cachedClient) return cachedClient;
  const apiKey = requireEnv('RESEND_API_KEY');
  cachedClient = new Resend(apiKey);
  return cachedClient;
}

export async function POST({ request }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { success: false, error: 'Invalid JSON body' });
  }

  const name    = sanitize(payload?.name);
  const email   = sanitize(payload?.email);
  const company = sanitize(payload?.company);
  const service = sanitize(payload?.service);
  const message = sanitize(payload?.message);

  if (!name)                  return json(400, { success: false, error: 'Name is required' });
  if (!email || !EMAIL_RE.test(email))
                              return json(400, { success: false, error: 'Valid email is required' });
  if (!service)               return json(400, { success: false, error: 'Service is required' });
  if (!message)               return json(400, { success: false, error: 'Message is required' });

  let resend;
  let from;
  let to;
  try {
    resend = getClient();
    // MAIL_FROM must be an address on a domain you've verified in Resend.
    // For unverified accounts, use the sandbox: "onboarding@resend.dev".
    from = requireEnv('MAIL_FROM');
    to   = requireEnv('MAIL_TO').split(',').map(s => s.trim()).filter(Boolean);
  } catch (err) {
    console.error('[contact] Resend not configured:', err);
    return json(500, { success: false, error: 'Email service not configured' });
  }

  const subject = `New enquiry from ${name} — ${service}`;

  const siteUrl = readEnv('SITE_URL') || 'https://nexoraglobales.com';
  const logoUrl = readEnv('LOGO_URL') || `${siteUrl}/nexora_new_logo.png`;
  const receivedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text =
    `New enquiry received via nexoraglobales.com\n\n` +
    `Name:     ${name}\n` +
    `Email:    ${email}\n` +
    `Company:  ${company || '(not provided)'}\n` +
    `Service:  ${service}\n` +
    `Received: ${receivedAt} IST\n\n` +
    `Message:\n${message}\n\n` +
    `— Reply directly to this email to respond to ${name}.\n`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#F5F2EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1410;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      New enquiry from ${escapeHtml(name)} regarding ${escapeHtml(service)}.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F2EC;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FFFFFF;border:1px solid #ECE6DC;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px 18px 28px;border-bottom:1px solid #F1ECE2;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="vertical-align:middle;">
                      <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;color:#1a1410;">
                        <img src="${escapeHtml(logoUrl)}" alt="Nexora" width="110" height="32" style="display:block;border:0;outline:none;height:auto;max-height:36px;">
                      </a>
                    </td>
                    <td align="right" style="vertical-align:middle;font-size:12px;color:#8A8278;letter-spacing:0.4px;text-transform:uppercase;">
                      New enquiry
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 8px 28px;">
                <p style="margin:0 0 6px 0;font-size:14px;color:#6B6359;">Hi team,</p>
                <p style="margin:0 0 18px 0;font-size:15px;line-height:1.55;color:#1a1410;">
                  You've received a new enquiry through <strong>nexoraglobales.com</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;line-height:1.5;border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;color:#8A8278;width:96px;vertical-align:top;">Name</td>
                    <td style="padding:8px 0;color:#1a1410;"><strong>${escapeHtml(name)}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8A8278;vertical-align:top;border-top:1px solid #F1ECE2;">Email</td>
                    <td style="padding:8px 0;border-top:1px solid #F1ECE2;"><a href="mailto:${escapeHtml(email)}" style="color:#D86810;text-decoration:none;">${escapeHtml(email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8A8278;vertical-align:top;border-top:1px solid #F1ECE2;">Company</td>
                    <td style="padding:8px 0;color:#1a1410;border-top:1px solid #F1ECE2;">${company ? escapeHtml(company) : '<span style="color:#B5AEA3;">Not provided</span>'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8A8278;vertical-align:top;border-top:1px solid #F1ECE2;">Service</td>
                    <td style="padding:8px 0;color:#1a1410;border-top:1px solid #F1ECE2;">${escapeHtml(service)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8A8278;vertical-align:top;border-top:1px solid #F1ECE2;">Received</td>
                    <td style="padding:8px 0;color:#1a1410;border-top:1px solid #F1ECE2;">${escapeHtml(receivedAt)} IST</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 4px 28px;">
                <p style="margin:0 0 8px 0;font-size:13px;color:#8A8278;text-transform:uppercase;letter-spacing:0.6px;">Message</p>
                <div style="padding:14px 16px;background:#FAF7F2;border-left:3px solid #D86810;border-radius:0 6px 6px 0;font-size:14px;line-height:1.6;color:#1a1410;white-space:pre-wrap;">${escapeHtml(message)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 24px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.55;color:#6B6359;">
                  Reply directly to this email to respond to ${escapeHtml(name)}.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 28px;background:#FAF7F2;border-top:1px solid #F1ECE2;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:12px;color:#8A8278;line-height:1.5;">
                      Sent from the contact form at
                      <a href="${escapeHtml(siteUrl)}" style="color:#8A8278;text-decoration:underline;">nexoraglobales.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0 0;font-size:11px;color:#A39B91;">Nexora Global ES &middot; Internal enquiry notification</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('[contact] Resend send failed:', error);
      return json(502, { success: false, error: 'Failed to send email. Please try again later.' });
    }

    return json(200, { success: true, id: data?.id });
  } catch (err) {
    console.error('[contact] Resend send threw:', err);
    return json(502, { success: false, error: 'Failed to send email. Please try again later.' });
  }
}
