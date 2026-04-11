"use client";
import { SidebarDemo } from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [queryClient] = useState(() => new QueryClient());
  return (
    <div>
        <QueryClientProvider client={queryClient}>
          <SidebarDemo>{children}</SidebarDemo>
        </QueryClientProvider>
    </div>
  );
}
