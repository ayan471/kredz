import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

const HeaderAccountDetails = () => {
  return (
    <>
    <div className="border rounded-md p-4 flex gap-4 justify-start">

    <Image className="max-w-[80px] md:max-w-[80px] rounded-full w-full" src="/global/person-2.jpg" alt="test" width="1000" height="1000"/>
    <div className="flex flex-col w-full gap-4">

    <div>
    <p className="text-md">Referal Code:</p>
    <p className="text-xs">axur87sw </p>
    </div>

    <div className="flex justify-start gap-2">
    <Button variant="outline" className="text-xs max-h-[28px] p-2 py-0">Copy</Button>    
    <Button variant="outline" className="text-xs max-h-[28px] p-2 py-0">Share</Button>
    </div>

    </div>

    </div>


</>


  )
}

export default HeaderAccountDetails