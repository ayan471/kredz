import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import Image from 'next/image'

export const revalidate = 10

const FullDescription = async(props:any) => {


  const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/destinations?acf_format=standard&_fields=id,title,acf&slug=`, { cache: 'no-store' } ); 
  const destinations = await req.json(); 
  const destination = destinations[0];

  return (
    <div className="relative w-full sm:p-4">

    <div className="bg-slate-50 max-w-[600px] mx-auto flex aling-middle justify-center gap-6 text-center flex-col  px-4 py-12">
    <h1 className="text-4xl font-EduVICWANTBeginner mb-4">{destination.acf.full_description.title}</h1>
      <p className="text-sm sm:text-md">

      <div className="postContParaFixCstm text-left"
      dangerouslySetInnerHTML={{__html: destination.acf.full_description.full_description}}
      />

        
      </p>
      <Link href="/destinations/punjab">
      <Button className="max-w-min mx-auto">Back To Destination</Button>
      </Link>
    </div>



    </div>
  )
}

export default FullDescription