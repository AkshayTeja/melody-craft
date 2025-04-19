"use client"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { Music, Sparkles, Zap, Layers, Users, Check, ChevronRight, Play, Download, Wand2 } from "lucide-react"



export default function BrandMarqueeSection() {
  const brands = [
    { name: "Universal Music", logo: "/universal.svg" },
    { name: "Sony Music", logo: "/sony.svg" },
    { name: "Warner Records", logo: "/warner.webp" },
    { name: "Capitol Records", logo: "/capitol.jpg" },
    { name: "Atlantic Records", logo: "/atlantic.png" },
  ];
  
  const firstRow = brands.slice(0, Math.ceil(brands.length / 2));
  const secondRow = brands.slice(Math.ceil(brands.length / 2));

  const BrandCard = ({ logo, name }: { logo: string; name: string }) => (
    <div className="flex flex-col items-center gap-2 px-4 py-2 w-36">
      <div className="w-full h-16 bg-white/10 backdrop-blur-md rounded-md border border-white/10 p-2 flex items-center justify-center">
        <Image
          src={logo}
          alt={name}
          width={120}
          height={40}
          className="object-cover opacity-70 hover:opacity-100 transition-opacity duration-300 h-14 rounded-md"
        />
      </div>
      <span className="text-xs text-gray-400 text-center whitespace-nowrap">{name}</span>
    </div>
  );

  return (
    <section className="border-y border-white/10 bg-white/5 backdrop-blur-md py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-center text-sm font-medium text-gray-400">
            TRUSTED BY MUSICIANS AND CREATORS WORLDWIDE
          </h2>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden max-w-4xl">
            <Marquee pauseOnHover reverse className="[--duration:15s]">
              {brands.map((brand, i) => (
                <BrandCard key={i} {...brand} />
              ))}
            </Marquee>
            {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
              {secondRow.map((brand, i) => (
                <BrandCard key={i} {...brand} />
              ))}
            </Marquee> */}
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/5"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white/5"></div> */}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {[
              "Grammy-winning producers",
              "Independent artists",
              "Film composers",
              "Game music creators",
              "Top 40 hitmakers",
            ].map((creator, i) => (
              <div
                key={i}
                className="rounded-full bg-white/5 backdrop-blur-md px-4 py-1 text-xs text-gray-400 border border-white/10"
              >
                {creator}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}