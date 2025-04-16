import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/home/ui/auth/ui/components/auth-button";
import { StudioUploadModal } from "@/modules/studio/ui/components/studio-upload-modal";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function StudioNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href={"/studio"} className="p-4">
            <Image src={"/logo1.svg"} alt="logo" width={150} height={50} />
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
