export const verificationEmailTemplate = (
  name: string,
  verificationLink: string
) => `
  <h2>Hello ${name},</h2>
  <p>click <a href="${verificationLink}">here</a> to verify your email.</p>
`;

export const PasswordResetTemplate = (name: string, link: string) => `
  <h2>Hello ${name},</h2>
  <p>We received a request to reset your password.</p>
  <p><a href="${link}" target="_blank">Click here to reset your password</a></p>
  <p>If you didn’t request this, you can ignore this email.</p>
  <p>Thanks,<br/>I4You Team</p>
`;
