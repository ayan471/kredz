import React from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import Image from 'next/image'

const InnerHeroOne = (props:any) => {


  return (
    <div className={`min-h-[380px] md:min-h-[420px] xl:min-h-[420px]`}>

        <Image 
        
        src={props.bgImgUrl} alt="" width="1920" height="600"
        className="h-full absolute object-cover max-h-[380px] md:max-h-[420px] xl:max-h-[420px] z-[-1]"
        />


        <div className="bg-[rgba(0,0,0,0.3)] flex aling-middle justify-center gap-6 md:gap-6 text-center flex-col min-h-[380px] md:min-h-[420px] xl:min-h-[420px] px-4 py-12 z-10">
        <h1 className="leading-10 font-semibold text-white text-[2.5rem] sm:text-5xl md:text-6xl xl:text-5xl  mb-[-8px] md:mb-[0px] z-10">{props.title}</h1>
        <p className="text-white text-xl z-10">{props.subtitle}</p>
        
        <Link href="#cstmContId" id="cstmContId" className="max-w-min mx-auto z-10">
          <Button className="max-w-min mx-auto font-normal text-xl md:text-xl bg-transparent hover:bg-transparent border-2 border-white text-white p-4 md:p-6 rounded-full">
            {props.ctaText} ↓
          </Button>
        </Link>
        </div>
    </div>
  )
}

export default InnerHeroOne