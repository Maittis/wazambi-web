import { insert, nowIso, readDb } from "./db";

export type SendResult = {
  ok: boolean;
  messageId?: string;
  error?: string;
};

function baseUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

function wrapHtml(body: string): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color:#101828;">
    <img src="https://wazambigps.com/images/wazambi-logo-dark-v2.svg" alt="Wazambi GPS" width="180" style="margin-bottom:20px;"/>
    ${body}
    <hr style="margin:32px 0; border:none; border-top:1px solid #EFEFEE;"/>
    <p style="font-size:12px; color:#98A2B3;">
      Wazambi GPS &middot; Lusaka, Zambia<br/>
      <a href="https://wazambigps.com/privacy-policy" style="color:#98A2B3;">Privacy Policy</a>
    </p>
  </div>`;
}

async function sendHtml(to: string, subject: string, html: string): Promise<SendResult> {
  const provider = process.env.EMAIL_PROVIDER || "log";

  if (provider === "resend" && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Wazambi GPS <hello@wazambigps.com>",
          to,
          subject,
          html,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, messageId: data.id };
      }
      const text = await res.text();
      return { ok: false, error: text.slice(0, 300) };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  console.log(`[email:log] To=${to} Subject="${subject}"`);
  insert("events", {
    eventType: "email_logged",
    meta: { to, subject },
    createdAt: nowIso(),
  });
  return { ok: true, messageId: `log-${Date.now()}` };
}

export async function sendPasswordResetEmail(to: string, firstName: string, resetUrl: string): Promise<SendResult> {
  const subject = "Reset your Wazambi portal password";
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">Hi ${firstName},</h2>
    <p>We received a request to reset the password for your Wazambi portal account.</p>
    <p style="margin: 20px 0 24px;">Click below to choose a new password. This link is valid for 30 minutes.</p>
    <a href="${resetUrl}" style="display:inline-block; background:#1E5EFF; color:#ffffff; text-decoration:none; font-weight:bold; padding:14px 28px; border-radius:100px;">CHOOSE A NEW PASSWORD</a>
    <p style="margin-top:28px; font-size:13px; color:#475467;">If you did not request this, you can safely ignore this email.</p>`);
  return sendHtml(to, subject, html);
}

type SendParams = {
  to: string;
  firstName: string;
  subject: string;
  guideName: string;
  guideUrl: string;
  courseCode: string;
};

function buildEmailHtml({ firstName, subject, guideName, guideUrl, courseCode }: SendParams): string {
  const assessmentUrl = courseCode === "fuel_monitoring" ? "/fuel-assessment" : "/fleet-assessment";
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; color:#101828;">
    <img src="https://wazambigps.com/images/wazambi-logo-dark-v2.svg" alt="Wazambi GPS" width="180" style="margin-bottom:20px;"/>
    <h2 style="color:#0A1633; margin-bottom: 8px;">Hi ${firstName},</h2>
    <p>Your free <strong>${guideName}</strong> is ready.</p>
    <p style="margin: 20px 0 24px;">This guide explains how to protect your vehicles, control fuel and run a clearer fleet — with the same systems our customers use.</p>
    <a href="${guideUrl}" style="display:inline-block; background:#FFC400; color:#0A1633; text-decoration:none; font-weight:bold; padding:14px 28px; border-radius:100px;">DOWNLOAD YOUR FREE GUIDE</a>
    <p style="margin-top:28px;">Want a recommended solution for your fleet? Complete a free assessment and we will send a quotation.</p>
    <a href="https://wazambigps.com${assessmentUrl}" style="display:inline-block; background:#1E5EFF; color:#ffffff; text-decoration:none; font-weight:bold; padding:14px 28px; border-radius:100px;">GET A FREE FLEET ASSESSMENT</a>
    <hr style="margin:32px 0; border:none; border-top:1px solid #EFEFEE;"/>
    <p style="font-size:12px; color:#98A2B3;">
      Wazambi GPS &middot; Lusaka, Zambia<br/>
      <a href="https://wazambigps.com/privacy-policy" style="color:#98A2B3;">Privacy Policy</a>
      &nbsp;&middot;&nbsp;
      <a href="https://wazambigps.com/unsubscribe" style="color:#98A2B3;">Unsubscribe</a>
    </p>
  </div>`;
}

export async function sendGuideEmail(params: SendParams): Promise<SendResult> {
  const provider = process.env.EMAIL_PROVIDER || "log";

  if (provider === "resend" && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Wazambi Academy <academy@wazambigps.com>",
          to: params.to,
          subject: params.subject,
          html: buildEmailHtml(params),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return { ok: true, messageId: data.id };
      }
      const text = await res.text();
      return { ok: false, error: text.slice(0, 300) };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  }

  console.log(`[email:log] To=${params.to} Subject="${params.subject}" Guide="${params.guideName}"`);
  insert("events", {
    eventType: "email_logged",
    meta: { to: params.to, subject: params.subject, guideName: params.guideName },
    createdAt: nowIso(),
  });
  return { ok: true, messageId: `log-${Date.now()}` };
}