import { SidebarProvider } from "@/components/ui/sidebar";
import StudioNavbar from "@/modules/studio/ui/components/studio-navbar";
import StudioSideBar from "@/modules/studio/ui/components/studio-sidebar";
import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}
export default function StudioLayouts({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSideBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
