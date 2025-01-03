import React from 'react'
import { Separator } from "@/components/ui/separator"

const DetailCard = () => {
  return (

    <div className="max-w-[480px] mx-auto">

    <div className="border-2 rounded-xl p-8 mt-8 mb-0 xl:mb-20">

    <ul className="flex flex-col gap-4">

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 1 - Buy the subscription</p>
      <p className="text-sm text-slate-600 mb-2">Buy Subscription Plan & Get Your upto 3X of monthly income. Pre-Approved Loan Offer Processed Instantly.</p>
      </li>

      <Separator />

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 2 - We will approve subscription</p>
      <p className="text-sm text-slate-600 mb-2">Choose from a dropdown list of services we have a lot to offer.</p>
      </li>


     
    </ul>

  </div>

  </div>
  )
}

export default DetailCard