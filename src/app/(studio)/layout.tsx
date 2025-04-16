import StudioLayouts from "@/modules/studio/ui/layouts/studio-layouts";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
  return <StudioLayouts>{children}</StudioLayouts>;
}
