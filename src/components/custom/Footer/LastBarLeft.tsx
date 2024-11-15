import React from 'react'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'

const LastBarLeft = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-row align-middle justify-center flex-wrap h-5 items-center space-x-4 text-xs sm:text-sm font-medium uppercase tracking-wider">
        <Link href="/contact">
        <div>Contact Us</div>
        </Link>
        <Separator orientation="vertical" />
        <Link href="/sitemap">
        <div>Sitemap</div>        
        </Link>
      </div>
    </div>
  )
}

export default LastBarLeft