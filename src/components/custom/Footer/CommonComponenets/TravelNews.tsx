import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const TravelNews = () => {
  return (

    <div className="flex flex-col gap-4">
      <p className="font-UrbanistLight tracking-wide">Credit Samdhan enhances financial inclusion through tailored microfinance solutions. We support small businesses, especially women entrepreneurs, and promote sustainable banking practices. Our mission is to provide accessible financial services that foster economic growth and community upliftment.</p>
      <Link href="/" target="_blank" className="max-w-min"><Button variant="outline" className="max-w-min">Lastest News</Button></Link>
      </div>

  )
}

export default TravelNews