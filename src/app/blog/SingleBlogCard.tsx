import React from 'react'
import Image from 'next/image'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

const SingleBlogCard = ({title, date, excerpt, slug, image}:any) => {


  let d = new Date(date);
  
  return (
    <div className="flex flex-col md:flex-row max-w-6xl m-auto py-8 px-4 sm:px-8 gap-8 border-b-2">

        <div className="flex flex-col gap-4 align-middle justify-center text-center md:text-left">
          <Link href={`/blog/${slug}`}>
            <h2 className="text-[#202020] text-xl sm:text-2xl xl:text-3xl font-bold">{title}</h2>
          </Link>
          <p className="text-slate-400  text-sm sm:text-xl font-UrbanistLight tracking-wide">{d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()}</p>
          <div className="text-sm sm:text-xl font-UrbanistLight tracking-wide"
            dangerouslySetInnerHTML={{__html: excerpt}}
          />
          <Link href={`/blog/${slug}`}>
            <Button className="bg-slate-800 text-justify text-sm sm:text-base font-UrbanistLight tracking-wide">Read Blog</Button>
          </Link>
        </div>

        <div className="flex flex-col order-[-1] md:order-1 gap-4 align-middle justify-center md:min-w-[280px] xl:min-w-[320px]">
          <Link href={`/blog/${slug}`}>
          <Image src={image} width="400" height="400" alt="blog thumbnail" className="m-auto rounded-md mx-h-[200px] sm:max-h-full"/>
          </Link>
        </div>

    </div>
  )
}

export default SingleBlogCard