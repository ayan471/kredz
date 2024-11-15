

import React from 'react'
import Image from 'next/image'


import PlanATripForm4 from './PlanATripForm5'

import Link from 'next/link'
import { Button } from '@/components/ui/button'



import { useState } from 'react'
import InnerHeroOne from '@/components/custom/Global/InnerHeroOne'
import DetailCard from './DetailCard'

const PlanATrip = () => {


 


  return (
    <>

      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Plan A Getaway!"
        subtitle="Fill the form and we will get back to you in 24 hours! test"
        ctaText="Fill The Form"
      />





      <div className="flex flex-col justify-center xl:flex-row">

        <div className="flex flex-1 mx-auto px-[20px]  justify-center w-full py-8 ">
         
         <DetailCard/>

        </div>





        <div className="flex  flex-1 mx-auto py-4 px-[20px] max-w-[620px] mt-8">

            <PlanATripForm4/>

        </div>





        <div className="flex flex-1 max-w-[620px] w-full  2xl:block">
        
      
        </div>




    </div>

    </>

  )
}

export default PlanATrip