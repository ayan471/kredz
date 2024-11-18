import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Micro Credit Service",
};

export default function DashboardLayout() {
    return (

    <SidebarProvider>
      <AppSidebar />



      <section>


      <SidebarTrigger />


        {/* Include shared UI here e.g. a header or sidebar */}
        <nav></nav>
   
  
      </section>
      </SidebarProvider>
    )
  }