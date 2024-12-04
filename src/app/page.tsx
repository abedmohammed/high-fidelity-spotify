"use client";

import Phone from "@/components/phone";
import { Slider } from "@/components/ui/slider";
import { song } from "@/lib/constants";
import {
  ChevronDown,
  Heart,
  Menu,
  MonitorSpeaker,
  Pause,
  Plus,
  Repeat2,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [value, setValue] = useState(0);

  const [minutes, seconds] = song.length.split(":").map(Number);
  const songLengthSeconds = minutes * 60 + seconds;

  const currentTime = Math.floor((value / 100) * songLengthSeconds);
  const remainingTime = songLengthSeconds - currentTime;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Phone>
      <div className="flex flex-col h-full px-6 font-semibold">
        <header className="basis-14 flex items-center justify-between">
          <ChevronDown />
          <p className="text-sm">{song.album}</p>
          <Menu />
        </header>
        <main className="flex-1 flex flex-col">
          <div className="basis-[400px] grid place-content-center">
            <Image
              className="rounded-lg"
              src={`/images/${song.cover}`}
              alt={`${song.name} by ${song.artist}`}
              width={300}
              height={300}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center">
              <div>
                <h1>{song.name}</h1>
                <p className="font-medium text-neutral-400">{song.artist}</p>
              </div>
              <div className="ml-auto flex gap-4">
                <Heart />
                <Plus />
              </div>
            </div>
            <div className="mt-8">
              <Slider
                defaultValue={[33]}
                className="cursor-pointer"
                max={100}
                step={1}
                value={[value]}
                onValueChange={(val) => setValue(val[0])}
              />
              <div className="mt-1 flex justify-between text-sm text-neutral-500 font-medium">
                <p>{formatTime(currentTime)}</p>
                <p>{formatTime(remainingTime)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <Shuffle />
                <SkipBack />
                <div className="h-14 w-14 rounded-full bg-white grid place-content-center">
                  <Pause
                    size={32}
                    className="fill-neutral-950"
                    strokeWidth={0.5}
                  />
                </div>
                <SkipForward />
                <Repeat2 />
              </div>
            </div>
          </div>
        </main>
        <footer className="basis-14 flex justify-between items-center">
          <MonitorSpeaker />
          <Share2 />
        </footer>
      </div>
    </Phone>
  );
}
