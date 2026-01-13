"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

interface ConditionalClerkProviderProps {
  children: React.ReactNode;
}

export function ConditionalClerkProvider({ children }: ConditionalClerkProviderProps) {
  // Check if Clerk publishable key is available
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no publishable key, render children without Clerk wrapper
  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      {children}
    </ClerkProvider>
  );
}
