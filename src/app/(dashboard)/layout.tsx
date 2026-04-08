import { SidebarDemo } from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <SidebarDemo>{children}</SidebarDemo>
    </div>
  );
}
