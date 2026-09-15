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

export async function sendAgentApplicationConfirmation(input: {
  to: string;
  firstName: string;
  submittedAt: string;
}): Promise<SendResult> {
  const subject = `We received your Wazambi GPS Agent application, ${input.firstName}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">Hi ${input.firstName},</h2>
    <p>Thank you for applying to become a <strong>Wazambi GPS Agent</strong>. Your application was received successfully.</p>
    <p style="margin: 18px 0;">What happens next:</p>
    <ul style="padding-left: 18px; line-height: 1.8; color:#344054;">
      <li>Our team reviews your application.</li>
      <li>If you are shortlisted, we will contact you with the next steps.</li>
      <li>Training and onboarding dates are shared only with successful applicants.</li>
    </ul>
    <p><strong>Important:</strong> this is an independent, commission-based opportunity. A unique <strong>Wazambi Agent Code</strong> is issued only <strong>after your application is approved</strong>.</p>
    <p style="margin-top: 24px;">Questions? Contact us and we will help.</p>`);
  return sendHtml(input.to, subject, html);
}

export async function sendAgentApplicationAdminNotification(input: {
  applicantName: string;
  email?: string;
  phone?: string;
  town?: string;
  submittedAt: string;
}): Promise<SendResult> {
  const to = process.env.AGENT_APPLICATIONS_TO || "hello@wazambigps.com";
  const subject = `New Agent application: ${input.applicantName}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">New Wazambi GPS Agent application</h2>
    <table style="border-collapse:collapse; font-size:14px; color:#101828; margin-top:12px;">
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Name</td><td style="padding:6px 0;"><strong>${input.applicantName}</strong></td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Email</td><td style="padding:6px 0;">${input.email || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Phone</td><td style="padding:6px 0;">${input.phone || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Town</td><td style="padding:6px 0;">${input.town || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Submitted</td><td style="padding:6px 0;">${input.submittedAt}</td></tr>
    </table>
    <p style="margin-top:20px;">Review the full application in the Agent Applications section of the admin dashboard.</p>`);
  return sendHtml(to, subject, html);
}

export async function sendAgentApprovalEmail(input: {
  to: string;
  firstName: string;
  agentCode: string;
}): Promise<SendResult> {
  const subject = `Approved! Your Wazambi GPS Agent Code is ${input.agentCode}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">Congratulations ${input.firstName},</h2>
    <p>Your application to become a <strong>Wazambi GPS Agent</strong> has been approved.</p>
    <p style="margin: 20px 0 6px;">Your unique Wazambi Agent Code is:</p>
    <div style="background:#FFC400; color:#0A1633; font-weight:800; letter-spacing:2px; font-size:22px; text-align:center; padding:16px; border-radius:10px; margin:12px 0 22px;">${input.agentCode}</div>
    <p>Use this code when registering customers so your commission is linked to you. Your agent platform access and onboarding details will follow.</p>
    <p style="margin-top: 22px;">Welcome to the Wazambi team.</p>`);
  return sendHtml(input.to, subject, html);
}

export async function sendCreatorApplicationConfirmation(input: {
  to: string;
  firstName: string;
  submittedAt: string;
}): Promise<SendResult> {
  const subject = `We received your Wazambi Creator application, ${input.firstName}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">Hi ${input.firstName},</h2>
    <p>Thank you for applying to the <strong>Wazambi Creator Program</strong>. Your application was received successfully.</p>
    <p style="margin: 18px 0;">What happens next:</p>
    <ul style="padding-left: 18px; line-height: 1.8; color:#344054;">
      <li>Our team reviews your content quality, experience and suitability.</li>
      <li>If you are approved, we will contact you with onboarding details.</li>
      <li>Approved creators publish Wazambi content and submit it for review.</li>
    </ul>
    <p><strong>Important:</strong> this is an independent, performance-based content opportunity. Earnings depend on approved content performance and views. It is not salaried employment.</p>
    <p style="margin-top: 24px;">Questions? Contact us and we will help.</p>`);
  return sendHtml(input.to, subject, html);
}

export async function sendCreatorApplicationAdminNotification(input: {
  creatorName: string;
  email?: string;
  phone?: string;
  town?: string;
  platforms?: string;
  submittedAt: string;
}): Promise<SendResult> {
  const to = process.env.CREATOR_APPLICATIONS_TO || "hello@wazambigps.com";
  const subject = `New Creator application: ${input.creatorName}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">New Wazambi Creator Program application</h2>
    <table style="border-collapse:collapse; font-size:14px; color:#101828; margin-top:12px;">
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Name</td><td style="padding:6px 0;"><strong>${input.creatorName}</strong></td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Email</td><td style="padding:6px 0;">${input.email || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Phone</td><td style="padding:6px 0;">${input.phone || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Town</td><td style="padding:6px 0;">${input.town || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Platforms</td><td style="padding:6px 0;">${input.platforms || "—"}</td></tr>
      <tr><td style="padding:6px 12px 6px 0; color:#667085;">Submitted</td><td style="padding:6px 0;">${input.submittedAt}</td></tr>
    </table>
    <p style="margin-top:20px;">Review the full application in the Creator Applications section of the admin dashboard.</p>`);
  return sendHtml(to, subject, html);
}

export async function sendCreatorApprovalEmail(input: {
  to: string;
  firstName: string;
  creatorCode: string;
}): Promise<SendResult> {
  const subject = `Approved! Your Wazambi Creator Code is ${input.creatorCode}`;
  const html = wrapHtml(`
    <h2 style="color:#0A1633; margin-bottom: 8px;">Congratulations ${input.firstName},</h2>
    <p>Your application to the <strong>Wazambi Creator Program</strong> has been approved.</p>
    <p style="margin: 20px 0 6px;">Your unique Wazambi Creator Code is:</p>
    <div style="background:#FFC400; color:#0A1633; font-weight:800; letter-spacing:2px; font-size:22px; text-align:center; padding:16px; border-radius:10px; margin:12px 0 22px;">${input.creatorCode}</div>
    <p>Use this code when submitting your published content so your earnings are tracked to you. Approved topics, brand guidelines and submission details will follow.</p>
    <p style="margin-top: 22px;">Welcome to the Wazambi Creator team.</p>`);
  return sendHtml(input.to, subject, html);
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