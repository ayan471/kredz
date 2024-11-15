"use client"

import { HTMLAttributes, useEffect, useState } from "react";

import WaveReveal from "@/components/animata/text/wave-reveal";
import { cn } from "@/lib/utils";
import AlgoliaWhiteButton from "@/components/animata/text/button/algolia-white-button";

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  item: { image: string; title: string };
  index: number;
  activeItem: number;
}

interface ExpandableProps {
  list?: { image: string; title: string }[];
  autoPlay?: boolean;
  className?: string;
}

const List = ({ item, className, index, activeItem, ...props }: ImageProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-20 min-w-10 cursor-pointer overflow-hidden rounded-md transition-all delay-0 duration-300 ease-in-out",
        {
          "flex-grow": index === activeItem,
        },
        className,
      )}
      {...props}
    >
      <img
        src={item.image}
        alt={item.title}
        className={cn("h-full w-full object-cover", {
          "blur-[2px]": index !== activeItem,
        })}
      />
      {index === activeItem && (
        <div className="flex flex-row">
        <div className="absolute bottom-4 left-4 min-w-fit text-white md:bottom-8 md:left-8 px-0">
          <WaveReveal
            duration="1000ms"
            className="px-0 items-start justify-start text-xl sm:text-2xl md:text-6xl font-semibold"
            text={item.title}
            direction="up"
          />
          <div className="ml-8 mt-6">
            
          <AlgoliaWhiteButton/>

          </div>  
        </div>
        </div>
      )}
    </div>
  );
};

const items = [
  {
    image:
      "https://images.unsplash.com/photo-1652604244093-1a06aca55929?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Amritsar, Punjab",
  },
  {
    image:
      "https://travelogyindia.b-cdn.net/storage/app/upload/uttarakhand.jpg",
    title: "Uttarakahand",
  },

];

export default function Expandable({ list = items, autoPlay = true, className }: ExpandableProps) {
  const [activeItem, setActiveItem] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveItem((prev) => (prev + 1) % list.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, list.length, isHovering]);

  return (
    <div className={cn("flex h-[580px] w-full gap-1", className)}>
      {list.map((item, index) => (
        <List
          key={item.title}
          item={item}
          index={index}
          activeItem={activeItem}
          onMouseEnter={() => {
            setActiveItem(index);
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
        />
      ))}
    </div>
  );
}
