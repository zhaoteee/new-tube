import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div>
        <Image src="/logo.svg" height={50} width={150} alt="logo" />
    </div>
  )
}
