import React from 'react'

import InnerHeroOne from '@/components/custom/Global/InnerHeroOne'
import SingleBlogCard from './SingleBlogCard'


import { client } from '@/app/lib/sanity'

import { urlFor } from '@/app/lib/sanity'



import { blogCard } from '@/app/lib/interface'

export const revalidate = 10;

async function getBlogs() {
  const query=`
  *[_type == 'blogs'] {
  title,
  image,
  "slug": slug.current, 
  excerpt,
  publishedAt,
  }`;

  const blogs = await client.fetch(query); 
  return blogs; 
}


const BlogPage = async() => {


  const blogs: blogCard[] = await getBlogs(); 
  console.log(blogs); 


  return (

    <div>

      <InnerHeroOne
        bgImgUrl="/global/banners/orange-gradient.jpg"
        title="Our Blogs"
        subtitle="Read experiences and stories"
        ctaText="Read Blogs"
      />




      <div>
      {
        blogs && blogs.map((blog:any) => {
          return (
            <div key={blog.id}>
              <SingleBlogCard 
              title={blog.title}
              date={blog.publishedAt}
              excerpt={blog.excerpt}
              slug={blog.slug}
              image={urlFor(blog.image).url()}
              />
            </div> 
          )

        })
      }
      </div>


    </div>
  )
}

export default BlogPage