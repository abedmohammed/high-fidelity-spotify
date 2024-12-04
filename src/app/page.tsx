"use client";

import Phone from "@/components/phone";
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
  const [value, setValue] = useState(0);

  const [data, setData] = useState<PlaylistData>({
    liked: song.map(() => false),
    playlists: {
      playlist1: [],
      playlist2: [],
      playlist3: [],
      playlist4: [],
    },
  });

  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [curSong, setCurSong] = useState(0);

  const [minutes, seconds] = song[curSong].length.split(":").map(Number);
  const songLengthSeconds = minutes * 60 + seconds;

  const currentTime = Math.floor((value / 100) * songLengthSeconds);
  const remainingTime = songLengthSeconds - currentTime;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const nextSong = () => {
    setCurSong((prev) => (prev + 1) % song.length);
    setValue(0);
  };

  const prevSong = () => {
    setCurSong((prev) => (prev - 1 + song.length) % song.length);
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
          <div className="basis-[400px] grid place-content-center">
            <Image
              className="rounded-lg"
              src={`/images/${song[curSong].cover}`}
              alt={`${song[curSong].name} by ${song[curSong].artist}`}
              width={300}
              height={300}
            />
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
                <Shuffle
                  onClick={() => setShuffle((prev) => !prev)}
                  className={cn(
                    "cursor-pointer transition-all",
                    shuffle && "stroke-primary"
                  )}
                />
                <SkipBack onClick={prevSong} className="cursor-pointer" />
                <div className="h-14 w-14 rounded-full bg-white grid place-content-center">
                  <Pause
                    size={32}
                    className="fill-neutral-950"
                    strokeWidth={0.5}
                  />
                </div>
                <SkipForward onClick={nextSong} className="cursor-pointer" />
                <Repeat2
                  onClick={() => setLoop((prev) => !prev)}
                  className={cn(
                    "cursor-pointer transition-all",
                    loop && "stroke-primary"
                  )}
                />
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
