import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import Image from 'next/image'

export const revalidate = 10

const HeroBanner = async(props:any) => {


  const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/destinations?acf_format=standard&_fields=id,title,acf&slug=${props.slug}`, { cache: 'no-store' } ); 
  const destinations = await req.json(); 
  const destination = destinations[0];

  return (
    <div className="relative w-full min-h-[380px] sm:min-h-[520px] bg-slate-50">

    <div className="bg-[#2F6BEB] flex aling-middle justify-center gap-6 text-center flex-col min-h-[380px] sm:min-h-[520px] px-4 py-12">
      <h1 className="text-white text-5xl sm:text-5xl md:text-7xl font-EduVICWANTBeginner z-10">
      <div
      dangerouslySetInnerHTML={{__html: destination.title.rendered}}
      />
      </h1>
      <p className="text-2xl text-white z-10">
        {destination.acf.sub_heading}
      </p>
    </div>

    <Image 
    src={destination.acf.large_image} 
    width="1920" 
    height="1080" 
    alt="background"
    className="absolute top-0 left-0 w-full h-full object-cover max-h-[520px] z-0"
    />

    </div>
  )
}

export default HeroBanner