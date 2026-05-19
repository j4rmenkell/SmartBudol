"use client";

import { useState } from "react";
import SpotlightCard from "@/components/SpotlightCard";
import BorderGlow from "@/components/BorderGlow";
import PixelTransition from "@/components/PixelTransition";

const teamMembers = [
  { id: "nazh", name: "Nazh", lastname: "Arcedo", image: "/team/Nazh.jpg" },
  {
    id: "johann",
    name: "Johann",
    lastname: "Batiancila",
    image: "/team/Johann.jpg",
  },
  {
    id: "lawrence",
    name: "Lawrence",
    lastname: "Balladares",
    image: "/team/Lawrence.png",
  },
  {
    id: "joshua",
    name: "Joshua",
    lastname: "Peñaverde",
    image: "/team/Joshua.jpg",
    hoverImage: "/team/JoshuaKaioken.jpg",
  },
];

export default function DevelopersPage() {
  const [activeDev, setActiveDev] = useState(teamMembers[0]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background relative overflow-hidden">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary-container/20 blur-3xl"
      /> */}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 xl:gap-16 items-center">
        <div className="flex flex-col gap-8 z-10">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/70">
              The people behind the build
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-on-surface via-primary to-primary-container font-headline leading-none">
              Meet the
              <br />
              Team
            </h1>
          </div>

          <div className="h-px w-16 bg-primary/30" />

          <div className="flex flex-col gap-1">
            {teamMembers.map((dev) => {
              const isActive = activeDev.id === dev.id;
              return (
                <button
                  key={dev.id}
                  onMouseEnter={() => setActiveDev(dev)}
                  onClick={() => setActiveDev(dev)}
                  className={`
                    group text-left flex items-center gap-4 px-4 py-4 rounded-xl
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "bg-primary/8 opacity-100"
                        : "opacity-40 hover:opacity-70 hover:bg-surface/50"
                    }
                  `}
                >
                  <span
                    className={`
                      h-10 w-0.5 shrink-0 rounded-full transition-all duration-300
                      ${isActive ? "bg-primary scale-y-100" : "bg-transparent scale-y-50"}
                    `}
                  />

                  <span className="flex flex-col">
                    <span
                      className={`
                        text-3xl md:text-4xl font-semibold leading-none transition-colors duration-300
                        ${isActive ? "text-on-surface" : "text-on-surface/80"}
                      `}
                    >
                      {dev.name}
                    </span>
                    <span
                      className={`
                        text-sm mt-1.5 transition-colors duration-300
                        ${isActive ? "text-primary" : "text-on-surface/50"}
                      `}
                    >
                      {dev.lastname}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative h-[520px] md:h-[700px] w-full flex items-center justify-center">
          <BorderGlow
            className="w-full max-w-[380px]"
            animated
            colors={["#00694c", "#008560", "#68dbae"]}
            glowColor="155 100 30"
            backgroundColor="var(--color-surface-container-lowest, #ffffff)"
            borderRadius={24}
          >
            <SpotlightCard
              className="flex flex-col items-center p-0 h-full w-full"
              spotlightColor="rgba(0, 105, 76, 0.15)"
            >
              <div className="w-full aspect-[3/4] relative overflow-hidden rounded-t-[23px] bg-surface-container-high">
                {activeDev.image ? (
                  activeDev.hoverImage ? (
                    // Pixel Transition for members with a hover image
                    <div className="absolute inset-0 w-full h-full cursor-pointer">
                      <PixelTransition
                        firstContent={
                          <img
                            src={activeDev.image}
                            alt={activeDev.name}
                            className="w-full h-full object-cover"
                          />
                        }
                        secondContent={
                          <img
                            src={activeDev.hoverImage}
                            alt={`${activeDev.name} Kaioken`}
                            className="w-full h-full object-cover"
                          />
                        }
                        gridSize={29}
                        pixelColor="white"
                        animationStepDuration={0.3}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    // Standard image fallback
                    <img
                      key={activeDev.id}
                      src={activeDev.image}
                      alt={activeDev.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    />
                  )
                ) : (
                  // Initial letter fallback
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-surface to-primary-container/15">
                    <span className="text-8xl md:text-9xl font-bold text-primary/20 font-headline select-none">
                      {activeDev.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 inset-x-0 p-6 pointer-events-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-headline leading-tight">
                    {activeDev.name}
                  </h2>
                  <p className="text-sm text-white/70 mt-1 font-medium tracking-wide">
                    {activeDev.lastname}
                  </p>
                </div>
              </div>

              <div className="w-full px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-on-surface/60 uppercase tracking-widest">
                    Smart Budol Team
                  </span>
                </div>
                <span className="text-xs font-mono text-on-surface/40">
                  0{teamMembers.findIndex((d) => d.id === activeDev.id) + 1} / 0
                  {teamMembers.length}
                </span>
              </div>
            </SpotlightCard>
          </BorderGlow>
        </div>
      </div>
    </div>
  );
}
