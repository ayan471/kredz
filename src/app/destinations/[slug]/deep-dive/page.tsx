import React from 'react'


import HeroBanner from '../HeroBanner'
import ShortDescription from '../ShortDescription'
import DataCards from '../DataCards'
import FullDescription from '../FullDescription'

const DeepDive = ({params}:any) => {
  return (
    <div>
        
        
 

        <HeroBanner pageTitle={params.slug}/>
        <FullDescription/>
   









    </div>
  )
}

export default DeepDive