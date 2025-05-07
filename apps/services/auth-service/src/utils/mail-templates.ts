export const verificationEmailTemplate = (name: string, code: string) => `
  <h2>Hello ${name},</h2>
  <p>Your verification code is: <strong>${code}</strong></p>
`;

export const PasswordResetTemplate = (name: string, link: string) => `
  <h2>Hello ${name},</h2>
  <p>We received a request to reset your password.</p>
  <p><a href="${link}" target="_blank">Click here to reset your password</a></p>
  <p>If you didn’t request this, you can ignore this email.</p>
  <p>Thanks,<br/>I4You Team</p>
`;
