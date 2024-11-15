import React from 'react'
import { Separator } from "@/components/ui/separator"

const DetailCard = () => {
  return (

    <div className="max-w-[480px] mx-auto">

    <div className="border-2 rounded-xl p-8 mt-8 mb-0 xl:mb-20">

    <ul className="flex flex-col gap-4">

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 1 - Tell Us About Yourself</p>
      <p className="text-sm text-slate-600 mb-2">Fill up the form and verify the personal details and more things.</p>
      </li>

      <Separator />

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 2 - Your Idea for a Getaway</p>
      <p className="text-sm text-slate-600 mb-2">Choose from a dropdown list of getaway types. We have a lot to offer.</p>
      </li>

      <Separator />

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 3 - Customized Getaway Plan</p>
      <p className="text-sm text-slate-600 mb-2">Receive a tailor-made itinerary based on your preferences.</p>
      </li>

      <Separator />

      <li>
      <p className="font-semibold  text-slate-800 mb-4">Step 4 - Book & Pay</p>
      <p className="text-sm text-slate-600 mb-2">Secure your dream getaway with easy payment options.</p>
      </li>

    </ul>

  </div>

  </div>
  )
}

export default DetailCard