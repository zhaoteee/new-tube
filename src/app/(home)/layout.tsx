import HomeLayouts from '@/modules/home/ui/layouts/home-layouts'
import React from 'react'

interface LayoutProps  {
    children: React.ReactNode
}

export default function layout({ children }: LayoutProps) {
  return (
    <HomeLayouts>{children}</HomeLayouts>
  )
}
