import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ErrorImage from '@/app/404.png'

const page = () => {
  return (
    <div className="min-h-[440px] flex flex-col text-center align-center justify-center">
      <Image className="m-auto" src={ErrorImage} alt="404 Error Image" width="300" height="400"/>
      <p className="mb-4 text-xl max-w-[600px] mx-auto">Thank You for purchasing the Subscription our loan processing team will contact with you within 24hrs</p>
      <Link href="/"><Button className="max-w-min m-auto">Go To Dashbaord</Button></Link>
    </div>
  )
}

export default page