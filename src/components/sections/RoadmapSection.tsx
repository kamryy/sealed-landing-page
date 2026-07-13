"use client";

import { useState } from "react";
import GradientBadge from "@/components/ui/GradientBadge";
import Image from "next/image";

interface IconProps {
  size?: number;
}

function CheckIcon({ size = 10 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12.5L9 17.5L20 6.5"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotIcon({ size = 6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
    </svg>
  );
}

/* ============================================================================
   TYPES
============================================================================ */

interface RoadmapItem {
  text: string;
  done: boolean;
}

interface RoadmapQuarter {
  id: string;
  label: string;
  current: boolean;
  items: RoadmapItem[];
}

/* ============================================================================
   ROADMAP DATA — EDIT HERE
   ============================================================================
   - "current: true" marks the quarter highlighted in the center as "current".
     Only one quarter can be set at a time.
   - Each item has "done: true/false" — marks whether the task is finished.
   - You can freely add / remove / reorder quarters and items,
     the interface will adapt on its own (arrow scrolling still works).
============================================================================ */

const ROADMAP_DATA: RoadmapQuarter[] = [
  {
    id: "q1-2026",
    label: "Q1 2026",
    current: false,
    items: [
      { text: "launch of MVP on testnet", done: true },
      { text: "simple wallet-to-wallet messaging", done: true },
      { text: "Alias Chat with receiver privacy", done: true },
      { text: "OHTTP push notifications", done: true },
      { text: "OHTTP RPC encryption", done: true },
      { text: "nickname setup", done: true },
      { text: "message Post Quantum encryption", done: true },
    ],
  },
  {
    id: "q2-2026",
    label: "Q2 2026",
    current: false,
    items: [
      { text: "mainnet launch", done: true },
      { text: "first active users", done: true },
      { text: "credit based messaging system", done: true },
      { text: "app pass code", done: true },
      { text: "app termination code", done: true },
    ],
  },
  {
    id: "q3-2026",
    label: "Q3 2026",
    current: true,
    items: [
      { text: "P2P phone calls, files sending & messaging", done: false },
      { text: "Google Play app launch", done: true },
      { text: "iOS app launch", done: false },
      { text: "Alias Chat with sender privacy", done: false },
      { text: "Post Quantum transaction signing", done: false },
      { text: "1000 monthly active users", done: false },
      { text: "Sealed PRO subscription", done: false },
      { text: "Sealed+ subscription", done: false },
      { text: "100 monthly active users", done: false },
    ],
  },
  {
    id: "q4-2026",
    label: "Q4 2026",
    current: false,
    items: [
      { text: "group creation", done: false },
      { text: "10 000 monthly active users", done: false },
      { text: "decentralized storage", done: false },
      { text: "Sealed Channel subscription", done: false },
      { text: "Desktop Sealed Channel app", done: false },
      { text: "Layer 2 launch", done: false },
      { text: "desktop app launch", done: false },
    ],
  },
  {
    id: "q1-2027",
    label: "Q1 2027",
    current: false,
    items: [
      { text: "25 000 monthly active users", done: false },
      { text: "Sealed channel development", done: false },
      { text: "TBD", done: false },
    ],
  },
];

/* ========================================================================== */

type TimelineDotState = "done" | "current" | "upcoming";

interface TimelineProps {
  state: TimelineDotState;
  isSelected: boolean;
  size?: "default" | "small";
  showLeftConnector?: boolean;
  showRightConnector?: boolean;
}
function Timeline({ state, isSelected, size = "default" }: TimelineProps) {
  const dim = size === "small" ? "h-3 w-3" : "h-3 w-3";
  const innerDim = size === "small" ? "h-1 w-1" : "h-1.5 w-1.5";
  const checkSize = size === "small" ? 5 : 7;
  const wrapperHeight = size === "small" ? "h-4" : "h-5";
  const connectorLength = size === "small" ? 34 : 46;
  const connectorGap = size === "small" ? 5 : 6;

  const fillColor = isSelected ? "bg-sealed-teal" : "bg-zinc-500";
  const connectorColor = isSelected ? "bg-sealed-teal" : "bg-zinc-700";
  const ringClass = isSelected
    ? "border-2 border-sealed-teal"
    : "border border-zinc-600 group-hover:border-zinc-400";

  const connectorStyle = (side: "left" | "right") => ({
    width: connectorLength,
    maxWidth: `calc(50% - ${connectorGap}px)`,
    marginRight: side === "left" ? connectorGap : undefined,
    marginLeft: side === "right" ? connectorGap : undefined,
  });

  let dot;
  if (state === "done") {
    dot = (
      <span
        className={`flex ${dim} flex-shrink-0 items-center justify-center rounded-full text-black ${fillColor}`}
      >
        <CheckIcon size={checkSize} />
      </span>
    );
  } else if (state === "current") {
    dot = (
      <span
        className={`flex ${dim} flex-shrink-0 items-center justify-center rounded-full border-1 ${
          isSelected ? "border-sealed-teal" : "border-zinc-500"
        }`}
      >
        <span className={`${innerDim} rounded-full ${fillColor}`} />
      </span>
    );
  } else {
    dot = (
      <span
        className={`flex ${dim} flex-shrink-0 rounded-full bg-transparent transition-colors ${ringClass}`}
      >
        <span className={`rounded-full bg-transparent`} />
      </span>
    );
  }

  return (
    <div
      className={`relative flex ${wrapperHeight} w-full items-center justify-center`}
    >
      {
        <span
          className={`pointer-events-none absolute right-1/2 h-px transition-colors ${connectorColor}`}
          style={connectorStyle("left")}
        />
      }
      <div className="z-10">{dot}</div>
      {
        <span
          className={`pointer-events-none absolute left-1/2 h-px transition-colors ${connectorColor}`}
          style={connectorStyle("right")}
        />
      }
    </div>
  );
}

interface TimelineCapProps {
  size?: "default" | "small";
}

function TimelineCap({ size = "default" }: TimelineCapProps) {
  const labelHeight = size === "small" ? "h-4" : "h-5";
  const wrapperHeight = size === "small" ? "h-4" : "h-5";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex flex-1 select-none flex-col items-center gap-1"
    >
      <span className={`flex ${labelHeight} items-center justify-center`} />
      <div
        className={`relative flex ${wrapperHeight} w-full items-center justify-center`}
      >
        <span className="h-px w-full bg-zinc-700" />
      </div>
    </div>
  );
}

interface StatusIconProps {
  done: boolean;
  isActive: boolean;
}

function StatusIcon({ done, isActive }: StatusIconProps) {
  if (done) {
    return (
      <span
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-black ${
          isActive ? "bg-sealed-teal" : "bg-sealed-teal/40"
        }`}
      >
        <CheckIcon size={10} />
      </span>
    );
  }

  return (
    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-600 text-zinc-500">
      <DotIcon size={6} />
    </span>
  );
}

interface QuarterColumnProps {
  quarter: RoadmapQuarter;
  variant: "active" | "side";
  collapsible?: boolean;
  visible?: boolean;
  spaced?: boolean;
}

function QuarterColumn({
  quarter,
  variant,
  collapsible = false,
  visible = true,
  spaced = false,
}: QuarterColumnProps) {
  const isActive = variant === "active";

  const items = (
    <ul className="relative flex flex-wrap gap-2">
      {quarter.items.map((item, i) => (
        <li
          key={i}
          className={`flex items-center gap-3 rounded-lg px-3 py-1 leading-snug text-sm ${
            isActive
              ? item.done
                ? "bg-sealed-teal/10 text-white"
                : "bg-zinc-800/80 text-white"
              : "bg-white/[0.02] text-zinc-500"
          }`}
        >
          <StatusIcon done={item.done} isActive={isActive} />
          {item.text}
        </li>
      ))}
    </ul>
  );

  const card = (
    <div className="relative flex flex-col gap-4 rounded-2xl p-5 transition-all w-full duration-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isActive ? 1 : 0.3,
          background:
            "linear-gradient(to top right, rgba(26,26,26,0) 0%, rgba(26,26,26,0.2) 40%, rgba(26,26,26,0.2) 100%), rgba(28,28,28,0.2)",
        }}
      />

      <h3
        className={`relative text-center font-medium ${
          isActive ? "text-base text-white" : "text-sm text-zinc-500"
        }`}
      >
        {quarter.label}
      </h3>

      {collapsible ? (
        <div
          className="relative grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">{items}</div>
        </div>
      ) : (
        items
      )}
    </div>
  );

  return (
    <div
      className="grid transition-all duration-300 ease-in-out"
      style={{
        gridTemplateRows: visible ? "1fr" : "0fr",
        marginTop: visible && spaced ? 12 : 0,
      }}
    >
      <div className="overflow-hidden">{card}</div>
    </div>
  );
}

export default function Roadmap() {
  const currentQuarterIndex = Math.max(
    0,
    ROADMAP_DATA.findIndex((q) => q.current),
  );
  const [activeIndex, setActiveIndex] = useState(currentQuarterIndex);

  // Detects a "big jump" (e.g. from the last quarter to the first via the timeline),
  // so that transition can be disabled for it — otherwise cards outside the visible
  // window would have to "drive through" the entire visible area.
  const [renderedActiveIndex, setRenderedActiveIndex] = useState(activeIndex);
  const [prevActiveIndex, setPrevActiveIndex] = useState(activeIndex);
  if (activeIndex !== renderedActiveIndex) {
    setPrevActiveIndex(renderedActiveIndex);
    setRenderedActiveIndex(activeIndex);
  }
  const isBigJump = Math.abs(activeIndex - prevActiveIndex) > 2;

  const total = ROADMAP_DATA.length;
  const leftIndex = activeIndex > 0 ? activeIndex - 1 : null;
  const rightIndex = activeIndex < total - 1 ? activeIndex + 1 : null;

  // Only for the mobile timeline strip — there the neighbor wraps around cyclically
  // (e.g. from Q1 2026 you see Q1 2027 on the left), even though the quarter cards don't.
  const timelineLeftIndex = (activeIndex - 1 + total) % total;
  const timelineRightIndex = (activeIndex + 1) % total;

  const goTo = (index: number) =>
    setActiveIndex(Math.max(0, Math.min(total - 1, index)));

  return (
    <div className="min-h-screen w-full py-16 text-white">
      <div className="mx-auto flex flex-col items-center gap-3">
        <GradientBadge>
          <Image
            src="/assets/icons/check-circle.svg"
            alt=""
            width={24}
            height={24}
          />
          <p className="font-lexend text-[clamp(0.95rem,1.4vw,1.125rem)] font-light leading-[1.35] text-white">
            Roadmap
          </p>
        </GradientBadge>
        <h1 className="text-center text-3xl font-semibold sm:text-4xl">
          Plans for future updates
        </h1>
        <p className="text-center md:text-left text-sm text-zinc-400">
          You can already use secure communication now, and many new features
          are still ahead of us.
        </p>
      </div>

      {/* Timeline / quarter navigation — desktop: all quarters */}
      <div className="relative mx-auto mt-12 hidden max-w-3xl md:block">
        <div className="relative flex items-center justify-between gap-4">
          <TimelineCap />
          {ROADMAP_DATA.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              className="group cursor-pointer flex flex-1 flex-col items-center gap-1 focus:outline-none"
            >
              <span
                className={` flex h-5 items-center justify-center transition-colors ${
                  i === activeIndex
                    ? "text-xs font-medium text-white"
                    : "text-xs font-medium text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                {q.label}
              </span>
              <Timeline
                state={
                  i < currentQuarterIndex
                    ? "done"
                    : i === currentQuarterIndex
                      ? "current"
                      : "upcoming"
                }
                isSelected={i === activeIndex}
              />
            </button>
          ))}
          <TimelineCap />
        </div>
      </div>

      {/* Timeline / quarter navigation — mobile: only 3 neighboring quarters */}
      <div className="relative mx-auto mt-10 max-w-xs md:hidden">
        <div className="relative flex items-center justify-between">
          {[timelineLeftIndex, activeIndex, timelineRightIndex].map(
            (i, pos) => (
              <button
                key={pos}
                onClick={() => goTo(i)}
                className="group flex flex-1 flex-col items-center gap-2 focus:outline-none cursor-pointer"
              >
                <span
                  className={`flex h-4 items-center justify-center transition-colors ${
                    i === activeIndex
                      ? "text-xs font-medium text-white"
                      : "text-xs font-medium text-zinc-500"
                  }`}
                >
                  {ROADMAP_DATA[i].label}
                </span>
                <Timeline
                  size="small"
                  state={
                    i < currentQuarterIndex
                      ? "done"
                      : i === currentQuarterIndex
                        ? "current"
                        : "upcoming"
                  }
                  isSelected={i === activeIndex}
                  showLeftConnector={pos > 0}
                  showRightConnector={pos < 2}
                />
              </button>
            ),
          )}
        </div>
      </div>

      {/* Quarter cards — desktop: 3 columns side by side, with sliding animation */}
      <div className="mt-10 hidden w-full justify-center md:flex">
        <div className="relative w-full max-w-7xl">
          {/* invisible spacer — keeps the section height the same as a regular grid */}
          <div
            aria-hidden="true"
            className="invisible grid grid-cols-3 items-start gap-4"
          >
            {leftIndex !== null && (
              <QuarterColumn quarter={ROADMAP_DATA[leftIndex]} variant="side" />
            )}
            <QuarterColumn
              quarter={ROADMAP_DATA[activeIndex]}
              variant="active"
            />
            {rightIndex !== null && (
              <QuarterColumn
                quarter={ROADMAP_DATA[rightIndex]}
                variant="side"
              />
            )}
          </div>

          {/* the actual, animated sliding track */}
          <div className="absolute inset-0 overflow-hidden">
            {ROADMAP_DATA.map((q, i) => {
              const offset = i - activeIndex;
              if (Math.abs(offset) > 2) return null;

              const slot = offset + 1;
              const isOffscreen = Math.abs(offset) > 1;
              const content = (
                <QuarterColumn
                  quarter={q}
                  variant={offset === 0 ? "active" : "side"}
                />
              );

              return (
                <div
                  key={q.id}
                  aria-hidden={isOffscreen}
                  className="absolute top-0"
                  style={{
                    width: "calc((100% - 32px) / 3)",
                    transform: `translateX(calc(${slot * 100}% + ${slot * 16}px))`,
                    transition: isBigJump ? "none" : "transform 450ms ease",
                  }}
                >
                  {offset === 0 ? (
                    content
                  ) : (
                    <button
                      onClick={() => goTo(i)}
                      tabIndex={isOffscreen ? -1 : 0}
                      className="w-full text-left focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-sealed-teal/50 rounded-2xl"
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quarter cards — mobile: vertical stack, expanding/collapsing on click.
          All quarters are always mounted (hidden via zero height), so the
          animation still works even when jumping more than one quarter at a time. */}
      <div className="mx-auto mt-8 flex max-w-md flex-col md:hidden">
        {ROADMAP_DATA.map((q, i) => {
          const offset = i - activeIndex;
          const isVisible = Math.abs(offset) <= 1;
          const isActive = i === activeIndex;

          return (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              tabIndex={isVisible ? 0 : -1}
              aria-hidden={!isVisible}
              className="text-left focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-sealed-teal/50 rounded-2xl"
            >
              <QuarterColumn
                quarter={q}
                variant={isActive ? "active" : "side"}
                collapsible
                visible={isVisible}
                spaced={i > 0}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
