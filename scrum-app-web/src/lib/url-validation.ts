/**
 * Validate callback URL to prevent open redirect vulnerability
 * @param url The URL to validate
 * @returns true if the URL is safe for redirection, false otherwise
 */
export function isValidCallbackUrl(url: string): boolean {
  // Must be a relative path starting with /
  if (!url.startsWith('/')) {
    return false;
  }
  
  // Must not contain // (to prevent protocol-relative URLs like //evil.com)
  if (url.includes('//')) {
    return false;
  }
  
  // Must not contain backslashes (to prevent bypass attempts)
  if (url.includes('\\')) {
    return false;
  }
  
  return true;
}
