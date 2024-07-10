import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react'

type Prop = {
  children: ReactNode
}

function layout({ children }: Prop) {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div>{children}</div>
    </div>
  )
}

export default layout;