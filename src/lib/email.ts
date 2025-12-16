type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendEmailUsingResend(options: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = options.from ?? process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!fromAddress) {
    throw new Error("RESEND_FROM_EMAIL is not configured");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${errorPayload}`);
  }
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  appName = "BreakLog",
}: {
  to: string;
  resetUrl: string;
  appName?: string;
}) {
  const subject = `${appName} password reset instructions`;
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:transparent;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:20px;padding:40px 32px;box-shadow:0 15px 45px rgba(15,23,42,0.08);">
                <tr>
                  <td style="text-align:center;padding-bottom:16px;">
                    <p style="margin:0;font-size:18px;font-weight:600;color:#e05d38;text-transform:uppercase;letter-spacing:0.08em;">${appName}</p>
                    <h1 style="margin:12px 0 0;font-size:26px;line-height:34px;color:#0f172a;">Reset your password</h1>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:16px;line-height:26px;color:#475467;padding-bottom:24px;">
                    <p style="margin:0 0 16px;">We received a request to reset the password for your <strong>${appName}</strong> account.</p>
                    <p style="margin:0;">If you made this request, click the secure button below to choose a new password. This link will expire soon for your safety.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;border-radius:999px;background:linear-gradient(135deg,#e05d38,#7786a9);color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;">Reset password</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;line-height:22px;color:#94a3b8;padding-bottom:24px;">
                    <p style="margin:0 0 8px;">If the button doesn’t work, copy and paste this link into your browser:</p>
                    <p style="margin:0;color:#6366f1;word-break:break-all;">${resetUrl}</p>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;line-height:22px;color:#94a3b8;">
                    <p style="margin:0;">Didn’t ask for a password reset? You can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `.trim();

  await sendEmailUsingResend({
    to,
    subject,
    html,
    text: `Reset your ${appName} password using this link: ${resetUrl}`,
  });
}
