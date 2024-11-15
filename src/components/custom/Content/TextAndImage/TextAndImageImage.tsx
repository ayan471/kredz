import React from 'react'
import Image from 'next/image'

const TextAndImageImage = (props:any) => {
  
  let leftImgExtraCls;
  if(props.imagePostion === "left") {
    leftImgExtraCls = "flex justify-end";
  }

  return (
    <div className={`w-full ${leftImgExtraCls}`}>
    <Image src={props.imageLink} width="800" height="800" alt="Image" className="my-8 xl:my-0"/>
</div>
  )
}

export default TextAndImageImage