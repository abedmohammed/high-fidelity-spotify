"use client";

import Phone from "@/components/phone";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { song } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Dot,
  Heart,
  Menu,
  MonitorSpeaker,
  Pause,
  Play,
  Plus,
  Repeat2,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type PlaylistData = {
  liked: boolean[];
  playlists: {
    playlist1: number[];
    playlist2: number[];
    playlist3: number[];
    playlist4: number[];
  };
};

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();

  const [value, setValue] = useState(0);
  const [paused, setPaused] = useState(false);

  const [data, setData] = useState<PlaylistData>({
    liked: song.map(() => false),
    playlists: {
      playlist1: [],
      playlist2: [],
      playlist3: [],
      playlist4: [],
    },
  });

  const [shuffle, setShuffle] = useState(0);
  const [loop, setLoop] = useState(0);
  const [curSong, setCurSong] = useState(0);

  useEffect(() => {
    setValue(0);
  }, [curSong]);

  const [minutes, seconds] = song[curSong].length.split(":").map(Number);
  const songLengthSeconds = minutes * 60 + seconds;

  const remainingTime = songLengthSeconds - value;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const nextSong = () => {
    setCurSong((prev) => (prev + 1) % song.length);
    api?.scrollTo(curSong + 1);
    setValue(0);
  };

  const prevSong = () => {
    setCurSong((prev) => (prev - 1 + song.length) % song.length);
    api?.scrollTo(curSong - 1);
    setValue(0);
  };

  const toggleLike = () => {
    setData((prevData) => {
      const newLiked = [...prevData.liked];
      newLiked[curSong] = !newLiked[curSong];
      return {
        ...prevData,
        liked: newLiked,
      };
    });
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurSong(api.selectedScrollSnap());

    api.on("select", () => {
      setCurSong(api.selectedScrollSnap());
    });
  }, [api]);

  const addToPlaylist = (playlistName: keyof PlaylistData["playlists"]) => {
    setData((prevData) => {
      const isInPlaylist = prevData.playlists[playlistName].includes(curSong);

      if (isInPlaylist) {
        return {
          ...prevData,
          playlists: {
            ...prevData.playlists,
            [playlistName]: prevData.playlists[playlistName].filter(
              (songIndex) => songIndex !== curSong
            ),
          },
        };
      }

      return {
        ...prevData,
        playlists: {
          ...prevData.playlists,
          [playlistName]: [...prevData.playlists[playlistName], curSong],
        },
      };
    });
  };

  const isInPlaylist = (playlistName: keyof PlaylistData["playlists"]) => {
    return data.playlists[playlistName].includes(curSong);
  };

  return (
    <Phone>
      <div className="flex flex-col h-full px-6 font-semibold">
        <header className="basis-14 flex items-center justify-between">
          <ChevronDown />
          <p className="text-sm">{song[curSong].album}</p>
          <Menu />
        </header>
        <main className="flex-1 flex flex-col">
          <div className="basis-[400px]">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
              }}
              className="ml-1.5 mt-12"
            >
              <CarouselContent>
                {song.map((curSongMap) => (
                  <CarouselItem key={curSongMap.name}>
                    <div className="w-[300px] h-[300px] relative cursor-grab">
                      <Image
                        className="rounded-lg"
                        src={`/images/${curSongMap.cover}`}
                        alt={`${curSongMap.name} by ${curSongMap.artist}`}
                        fill
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center">
              <div>
                <h1>{song[curSong].name}</h1>
                <p className="font-medium text-neutral-400">
                  {song[curSong].artist}
                </p>
              </div>
              <div className="ml-auto flex gap-4">
                <Heart
                  className={cn(
                    "cursor-pointer transition-all",
                    data.liked[curSong] && "fill-primary stroke-primary"
                  )}
                  onClick={toggleLike}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Plus className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" side="top" align="end">
                    <DropdownMenuLabel>Add to Playlist</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      onSelect={(event) => event.preventDefault()}
                      checked={data.liked[curSong]}
                      onCheckedChange={toggleLike}
                    >
                      <div className="flex items-center gap-2 pl-3 h-8">
                        <Heart
                          className={cn(
                            "transition-all w-42",
                            data.liked[curSong] && "fill-primary stroke-primary"
                          )}
                        />
                        <p className="pl-3">Liked</p>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      onSelect={(event) => event.preventDefault()}
                      checked={isInPlaylist("playlist1")}
                      onCheckedChange={() => addToPlaylist("playlist1")}
                    >
                      <div className="flex items-center gap-2 pl-2 h-8">
                        <Image
                          className="rounded-sm"
                          src="/images/gym.jpeg"
                          alt="Guy working out"
                          width={42}
                          height={42}
                        />
                        <p>Workout 🦾</p>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onSelect={(event) => event.preventDefault()}
                      checked={isInPlaylist("playlist2")}
                      onCheckedChange={() => addToPlaylist("playlist2")}
                    >
                      <div className="flex items-center gap-2 pl-2 h-8">
                        <Image
                          className="rounded-sm"
                          src="/images/drive.jpeg"
                          alt="Guy working out"
                          width={42}
                          height={42}
                        />
                        <p>Weekend Vibes 🥶</p>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onSelect={(event) => event.preventDefault()}
                      checked={isInPlaylist("playlist3")}
                      onCheckedChange={() => addToPlaylist("playlist3")}
                    >
                      <div className="flex items-center gap-2 pl-2 h-8">
                        <Image
                          className="rounded-sm"
                          src="/images/honkshoo.png"
                          alt="Guy working out"
                          width={42}
                          height={42}
                        />
                        <p>Bedtime 😴</p>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      onSelect={(event) => event.preventDefault()}
                      checked={isInPlaylist("playlist4")}
                      onCheckedChange={() => addToPlaylist("playlist4")}
                    >
                      <div className="flex items-center gap-2 pl-2 h-8">
                        <Image
                          className="rounded-sm"
                          src="/images/lofistudygirl.webp"
                          alt="Guy working out"
                          width={42}
                          height={42}
                        />
                        <p>Studying 📚</p>
                      </div>
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-8">
              <Slider
                defaultValue={[33]}
                className="cursor-pointer"
                max={songLengthSeconds}
                step={1}
                value={[value]}
                onValueChange={(val) => setValue(val[0])}
              />
              <div className="mt-1 flex justify-between text-sm text-neutral-500 font-medium">
                <p>{formatTime(value)}</p>
                <p>{formatTime(remainingTime)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div
                  className="cursor-pointer relative"
                  onClick={() =>
                    setShuffle((prev) => {
                      if (prev === 0) return 1;
                      if (prev === 1) return 2;
                      return 0;
                    })
                  }
                >
                  {shuffle !== 2 && (
                    <Shuffle
                      className={cn(
                        "transition-all",
                        shuffle && "stroke-primary"
                      )}
                    />
                  )}

                  {shuffle === 2 && (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-shuffle stroke-primary"
                      >
                        <path d="m18 14 4 4-4 4" />
                        <path d="m18 2 4 4-4 4" />
                        <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
                        <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
                      </svg>
                      <Sparkle
                        className="absolute top-0 -left-1 fill-primary stroke-none"
                        size={14}
                      />
                    </>
                  )}
                </div>
                <SkipBack onClick={prevSong} className="cursor-pointer" />
                <div
                  className="h-14 w-14 rounded-full bg-white grid place-content-center cursor-pointer"
                  onClick={() => setPaused((prev) => !prev)}
                >
                  {paused ? (
                    <Play size={32} className="fill-neutral-900" />
                  ) : (
                    <Pause
                      size={32}
                      className="fill-neutral-900"
                      strokeWidth={0.5}
                    />
                  )}
                </div>
                <SkipForward onClick={nextSong} className="cursor-pointer" />
                <div
                  className="cursor-pointer relative"
                  onClick={() =>
                    setLoop((prev) => {
                      if (prev === 0) return 1;
                      if (prev === 1) return 2;
                      return 0;
                    })
                  }
                >
                  <Repeat2
                    className={cn(
                      "cursor-pointer transition-all",
                      loop && "stroke-primary"
                    )}
                  />
                  {loop === 2 && (
                    <Dot className="absolute top-4 stroke-primary" />
                  )}
                </div>
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
