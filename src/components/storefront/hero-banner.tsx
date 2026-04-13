"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brandConfig } from "../../../brand.config";

export function HeroBanner() {
  const banners = brandConfig.homepage.heroBanners;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const banner = banners[current];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`bg-gradient-to-r ${banner.bgColor} text-white py-16 md:py-24 lg:py-32 transition-all duration-500`}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            {banner.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {banner.subtitle}
          </p>
          <Link href={banner.buttonLink}>
            <Button size="lg" variant="secondary" className="text-base px-8">
              {banner.buttonText}
            </Button>
          </Link>
        </div>
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
        </>
      )}
    </div>
  );
}
