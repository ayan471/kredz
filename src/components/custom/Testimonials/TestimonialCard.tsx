/**
 * v0 by Vercel.
 * @see https://v0.dev/t/caxZN8MSFN4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Image from 'next/image'

export default function Component(props:any) {
  return (
    <Card className="border-none shadow-none w-full grid gap-6">

      <blockquote className="text-md leading-relaxed md:text-md">
     
    <div className="text-slate-800 max-w-min testContCstCls font-UrbanistLight tracking-wide text-md sm:text-base"
      dangerouslySetInnerHTML={{__html: props.testimnlTestimonial}} 
    />
        </blockquote>

        <div className="flex items-center gap-4">
        { (props.testimnlPersonImage) &&
          <Image src={props.testimnlPersonImage} className="rounded-full shadow-sm bg-[#246BEB]" alt="Testimonial Image" width="80" height="80"/> 
        }

        <div className="grid">
          <div className="text-slate-800 font-bold font-UrbanistLight tracking-wide text-md sm:text-base">- {props.testimnlName}</div>
          <div className="text-slate-800 text-sm text-muted-foreground">{props.testimnlDesignation}</div>
        </div>
      </div>


      
    </Card>
  )
}