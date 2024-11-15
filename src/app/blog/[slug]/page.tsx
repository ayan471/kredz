import React, { useEffect } from 'react'
import BlogRenderModule from './BlogRenderModule'
import { Button } from '@/components/ui/button';
import NotFound from '@/components/custom/Global/PageNotFound'


import { singleBlogPost } from '@/app/lib/interface'

import { client } from '@/app/lib/sanity'


export const revalidate = 10;

async function getBlog(slug:any) {
  const query=`
*[_type == 'blogs' && slug.current  == '${slug}'] {
  full_image,
  title,
  "slug": slug.current, 
  publishedAt,
  details,
}[0]`;

  const blog = await client.fetch(query); 
  return blog; 
}


const Blog = async({ params }:any) => {

  const blog: singleBlogPost = await getBlog(params.slug); 
  console.log(blog); 




    if(blog != undefined){
      return <BlogRenderModule pageData={blog}/> 
    }
    else {
      return <NotFound/>
    }

}

export default Blog



