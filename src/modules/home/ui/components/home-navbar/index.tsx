import { SidebarTrigger } from '@/components/ui/sidebar'
import AuthButton from '@/modules/home/ui/auth/ui/components/auth-button'
import SearchInput from '@/modules/home/ui/components/home-navbar/search-input'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HomeNavbar() {
  return (
    <div className='fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50'>
        <div className='flex items-center gap-4 w-full'>
            <div className='flex items-center flex-shrink-0'>
                <SidebarTrigger />
                <Link href={"/"} className='p-4'>
                    <Image src={"/logo.svg"} alt="logo" width={130} height={50} />
                </Link>
            </div>
            <div className='flex-1 flex justify-center max-w-[720px] mx-auto'>
              <SearchInput />
            </div>
            <div className='flex-shrink-0 items-center flex gap4'>
              <AuthButton />
            </div>
        </div>
    </div>
  )
}
