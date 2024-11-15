import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import Image from 'next/image'

export const revalidate = 10

const DataCards = async(props:any) => {


  const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/destinations?acf_format=standard&_fields=id,title,acf`, { cache: 'no-store' } ); 
  const destinations = await req.json(); 
  const destination = destinations[0];

  return (
    <div className="relative w-full sm:p-4 mt-4">
        <div className="bg-slate-50 max-w-[1200px] mx-auto flex aling-middle justify-center gap-6 text-center rounded-3xl  px-4 py-12">


        <div className="basis-1/2 md:basis-1/4 flex flex-col gap-2">
            <DataCardImage url="/global/cards/about-1.png" alt="Travel For"/>
            <p className="font-bold mt-2">Travel For</p>
            <p className="mx-8 text-sm">{destination.acf.cards.travel_for}</p>
        </div>

        <div className="basis-1/2 md:basis-1/4 flex flex-col gap-2">
            <DataCardImage url="/global/cards/about-2.png" alt="Travel For"/>
            <p className="font-bold mt-2">Best Time To Visit</p>
            <p className="mx-8 text-sm">{destination.acf.cards.best_time}</p>
        </div>

        <div className="basis-1/2 md:basis-1/4 flex flex-col gap-2">
            <DataCardImage url="/global/cards/about-3.png" alt="Travel For"/>
            <p className="font-bold mt-2">Speak</p>
            <p className="mx-8 text-sm">{destination.acf.cards.speak}</p>
        </div>

        <div className="basis-1/2 md:basis-1/4 flex flex-col gap-2">
            <DataCardImage url="/global/cards/about-4.png" alt="Travel For"/>
            <p className="font-bold mt-2">Currency</p>
            <p className="mx-8 text-sm">{destination.acf.cards.currency}</p>
        </div>


        </div>
    </div>
  )
}

function DataCardImage(props:any) {
    return (
    
        <Image 
        src={props.url} 
        alt={props.alt} 
        width="512" 
        height="512"
        className="max-w-[80px] mx-auto rounded-3xl"
        />
      
    )

}


export default DataCards