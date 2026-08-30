export const ADMIN_EMAILS = [
  'vominhtri1610@gmail.com'
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
