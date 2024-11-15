import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'

export const revalidate = 10

const IndividualOffering = async({params}:any) => {

    const req = await fetch(`https://dashboard.geranosgetaways.com/wp-json/wp/v2/offerings?acf_format=standard&_fields=id,title,date,excerpt,acf&slug=${params.slug}`, { cache: 'no-store' } ); 
    const offerings = await req.json(); 
    const offering = offerings[0]; 


  return (
    <div>

        <div className="bg-cover bg-[url('/global/banners/contact-3.jpg')]  min-h-[420px]  bg-slate-50">
            <div className="bg-[rgba(0,0,0,0.3)] flex aling-middle justify-center gap-6 text-center flex-col min-h-[420px] px-4 py-12">
            <h1 className="text-white text-7xl font-SedgwickAve">{offering.title.rendered}</h1>
            <p className="text-white text-xl">{params.slug}</p>
            
            </div>
        </div>



    </div>
  )
}

export default IndividualOffering