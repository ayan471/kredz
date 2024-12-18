"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/components/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const locations: {
  title: string;
  href: string;
  description: string;
  comingSoon: string;
}[] = [
  {
    title: "Personal Consultancy",
    href: "/loan-application",
    description: "",
    comingSoon: "no",
  },
  {
    title: "Credit Builder Plans",
    href: "/credit-builder",
    description: "",
    comingSoon: "no",
  },
  {
    title: "Channel Partner",
    href: "",
    description: "",
    comingSoon: "yes",
  },
  {
    title: "Loan Consultancy",
    href: "",
    description: "",
    comingSoon: "yes",
  },
];

const experiences: { title: string; href: string; description: string }[] = [
  {
    title: "Tour Packages",
    href: "",
    description: "",
  },
  {
    title: "Weekend Getaways",
    href: "",
    description: "",
  },
  {
    title: "Experiences",
    href: "",
    description: "",
  },
];

export default function NavigationMenuDemo() {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-0 xl:gap-8 flex-row">
          <NavigationMenuItem>
            <Link href="/about-us" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <p className="uppercase tracking-wider">About</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="uppercase tracking-wider">
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className=" grid w-[400px] gap-3 p-4 md:w-[330px] md:grid-cols-1 lg:w-[330px] ">
                {locations.map((location) => (
                  <Link href={location.href} className="flex flex-row">
                    <ListItem key={location.title} title={location.title}>
                      {location.description}
                    </ListItem>
                    {location.comingSoon == "yes" && (
                      <span className="my-auto text-xs border rounded-full px-2 py-1">
                        Coming Soon
                      </span>
                    )}
                  </Link>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <p className="uppercase tracking-wider">Contact</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
