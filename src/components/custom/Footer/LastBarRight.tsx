import React from 'react'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'

const LastBarRight = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-row align-middle justify-center flex-wrap h-5 items-center space-x-4 text-xs sm:text-sm font-medium uppercase tracking-wider">
        <Link href="/privacy-policy">
        <div className="ml-0">Privacy Policy</div>
        </Link>
        <Separator orientation="vertical" />
        <Link href="/terms-of-use">
        <div>Terms Of Use</div>
        </Link>

     
      </div>
    </div>
  )
}

export default LastBarRight