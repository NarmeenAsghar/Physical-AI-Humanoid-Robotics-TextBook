/**
 * Navigation utilities for handling Docusaurus base URL
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Get the full path with Docusaurus base URL
 * @param path - Relative path (e.g., '/signup', '/signin')
 * @returns Full path with base URL (e.g., '/physical-ai-and-humaniod-robotics/signup')
 */
export function useBasePath(path: string): string {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Combine base URL with path, ensuring no double slashes
  if (baseUrl === '/') {
    return `/${cleanPath}`;
  }

  return `${baseUrl}${cleanPath}`;
}

/**
 * Hook to get a navigate function that respects base URL
 */
export function useBaseNavigate() {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  return (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const fullPath = baseUrl === '/' ? `/${cleanPath}` : `${baseUrl}${cleanPath}`;

    if (typeof window !== 'undefined') {
      window.location.href = fullPath;
    }
  };
}
