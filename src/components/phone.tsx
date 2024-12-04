"use client";

import { BatteryFull, SignalHigh, Wifi } from "lucide-react";

type props = {
  children: React.ReactNode;
};

export default function Phone({ children }: props) {
  return (
    <div className="grid place-content-center min-h-screen">
      <div className="bg-muted-foreground rounded-[43px] p-[2px]">
        <div className="bg-black rounded-[42px] p-3">
          <div className="w-[360px] h-[750px] rounded-[30px] flex flex-col bg-neutral-900">
            <header className="h-12 flex justify-between items-center p-4">
              <div className="flex-1">
                <p className="ml-1">12:36</p>
              </div>
              <div className="h-5 bg-black rounded-full w-[70px] flex items-center"></div>
              <div className="flex-1 flex gap-2 items-center justify-end">
                <SignalHigh />
                <Wifi className="mr-1" />
                <BatteryFull />
              </div>
            </header>
            <main className="h-full">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
