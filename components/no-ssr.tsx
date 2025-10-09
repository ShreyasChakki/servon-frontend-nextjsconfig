'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

interface NoSSRProps {
  children: React.ReactNode
}

const NoSSR = ({ children }: NoSSRProps) => {
  return <>{children}</>
}

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
})

// Alternative utility function for wrapping components
export function withNoSSR<P extends object>(Component: ComponentType<P>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  })
}