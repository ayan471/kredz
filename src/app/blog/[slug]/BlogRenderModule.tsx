import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/app/lib/sanity'
import { PortableText } from 'next-sanity'

const BlogRenderModule = (props: any) => {

 



  return (       

    <>
        { (props.pageData.full_image) && 
            <Image 
            src={urlFor(props.pageData.full_image).url()}
            width="1920" 
            height="1080" 
            alt="featured image"
            className="max-h-[400px] object-cover"
            />
        }
        <div className="max-w-[800px] m-auto px-4">

        <div className="text-3xl md:text-4xl text-left font-bold py-[40px] md:py-[80px]">{props.pageData.title}</div>
        <p className="postContParaFixCstm text-left"></p>
        <div className="prose prose-md text-justify">
        <PortableText value={props.pageData.details}/>
        </div>
    </div>

    </>
  )
}

export default BlogRenderModule