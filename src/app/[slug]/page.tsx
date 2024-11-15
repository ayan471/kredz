import React, { useEffect } from 'react'
import PageRenderModule from './PageRenderModule'
import { Button } from '@/components/ui/button';
import NotFound from '@/components/custom/Global/PageNotFound'


import { singleBlogPost } from '@/app/lib/interface'

import { client } from '@/app/lib/sanity'


export const revalidate = 10


async function getPage(slug:any) {
  const query=`
*[_type == 'pages' && slug.current  == '${slug}'] {
  full_image,
  title,
  "slug": slug.current, 
  publishedAt,
  details,
}[0]`;

  const page = await client.fetch(query); 
  return page; 
}





const Page = async({ params }:any) => {

  const page: singleBlogPost = await getPage(params.slug); 
  console.log(page); 


    if(page != undefined){
      return <PageRenderModule pageData={page}/> 
    }
    else {
      return <NotFound/>
    }




}

export default Page