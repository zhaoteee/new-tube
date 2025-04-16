"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FilterCarouselProps {
  value?: string;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: { value: string; label: string }[];
}

export const FilterCarousel = ({
  value,
  onSelect,
  data,
  isLoading,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 && "hidden"
        )}
      />
      <Carousel
        className="w-full px-12"
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
        }}
      >
        <CarouselContent className="px-1">
          {isLoading &&
            Array.from({ length: 14 }).map((_, idx) => (
              <CarouselItem key={idx} className="pl-3 basis-auto">
                <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading && (
            <>
              <CarouselItem
                className="pl-3 basis-auto"
                onClick={() => onSelect(null)}
              >
                <Badge
                  variant={!value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-normal text-sm"
                >
                  All
                </Badge>
              </CarouselItem>
              {data.map((item) => (
                <CarouselItem
                  onClick={() => onSelect(item.value)}
                  key={item.value}
                  className="pl-3 basis-auto"
                >
                  <Badge
                    variant={value === item.value ? "default" : "secondary"}
                    className="rounded-lg px-3 py-1 cursor-pointer whitespace-normal text-sm"
                  >
                    {item.label}
                  </Badge>
                </CarouselItem>
              ))}
            </>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden"
        )}
      />
    </div>
  );
};
