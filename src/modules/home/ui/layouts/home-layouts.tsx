import { SidebarProvider } from "@/components/ui/sidebar";
import HomeNavbar from "@/modules/home/ui/components/home-navbar";
import HomeSideBar from "@/modules/home/ui/components/home-sidebar";
import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}
export default function HomeLayouts({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <HomeSideBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
