import React from 'react'


import Image from 'next/image'
import TextAndImageImage from './TextAndImageImage'
import TextAndImageText from './TextAndImageText'


const TextAndImage = (props:any) => {
  return (
    <div className="max-w-[1800px]  flex m-auto w-full  sm:max-w-[800px] xl:max-w-full">
        <div className="flex gap-2 md:gap-16 flex-col justify-between w-full xl:flex-row p-4 pb-2 pt-0">
        {
          ((props.imagePostion) === "left") &&
              <TextAndImageImage imageLink={props.imageLink} imagePostion={props.imagePostion}/>
        }    
        
        <TextAndImageText 
        titleText={props.titleText} 
        subHeading={props.subHeading} 
        content={props.content}
        ctaText={props.ctaText}
        ctaLink={props.ctaLink}
        />

        {
          ((props.imagePostion) === "right") &&
              <TextAndImageImage imageLink={props.imageLink}/>
        }  
            


        </div>
    </div>
  )
}

export default TextAndImage