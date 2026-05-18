'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Client-side provider to manage NextAuth sessions.
 * @param {React.ReactNode} children - The child components.
 * @returns {JSX.Element} The provider wrapper.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}