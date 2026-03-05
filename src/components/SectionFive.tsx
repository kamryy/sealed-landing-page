'use client';

import SectionHeader from '@/components/SectionHeader';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type BoxContent = '1' | '2' | '3' | '4' | '5';
type StepIndex = 0 | 1 | 2 | 3 | 4;

interface BoxData {
  id: BoxContent;
  title: string;
  description: string;
}

const boxesData: BoxData[] = [
  {
    id: '1',
    title: 'Secure exchange of access keys',
    description:
      'Cryptographic keys are safely shared between parties to ensure only authorized access',
  },
  {
    id: '2',
    title: 'End-to-end encryption of the message payload',
    description:
      'Message data is encrypted before transmission and remains protected throughout the entire process',
  },
  {
    id: '3',
    title: 'Submitting an encrypted message to the blockchain',
    description:
      'The encrypted message is immutably recorded on the blockchain without exposing its contents',
  },
  {
    id: '4',
    title: 'Data retrieval from the blockchain',
    description:
      'Encrypted data is securely fetched from the blockchain when needed',
  },
  {
    id: '5',
    title: 'Local decryption using the access key',
    description:
      "The message is decrypted on the user's device using the appropriate access key.",
  },
];

interface BoxProps {
  content: BoxContent;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function Box({ content, isActive, onHover, onLeave }: BoxProps) {
  const boxData = boxesData.find((box) => box.id === content)!;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex w-full max-w-[380px] cursor-pointer flex-col items-center gap-2.5 rounded-[15px] p-7 shadow-sm transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-transparent to-[#1a1a1a]'
          : 'bg-gradient-to-br from-transparent to-[rgba(26,26,26,0.2)]'
      }`}
      style={{
        backgroundImage: isActive
          ? 'linear-gradient(206deg, rgba(26, 26, 26, 0) 0%, rgb(26, 26, 26) 40%), linear-gradient(90deg, rgb(28, 28, 28) 0%, rgb(28, 28, 28) 100%)'
          : 'linear-gradient(199deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.2) 40%), linear-gradient(90deg, rgba(28, 28, 28, 0.2) 0%, rgba(28, 28, 28, 0.2) 100%)',
      }}
    >
      {/* Icon Container */}
      <div className="relative size-10">
        <div
          className={`absolute -inset-[15%] flex items-center justify-center rounded-lg border transition-all duration-300 ${
            isActive
              ? 'border-sealed-teal bg-sealed-teal/10'
              : 'border-[#7c7c7c] bg-white/5'
          }`}
        >
          <Image
            src="/assets/section_five/icon.svg"
            alt=""
            width={40}
            height={40}
            className={`transition-all duration-300 ${isActive ? 'brightness-100' : 'brightness-50'}`}
          />
        </div>
      </div>

      {/* Title */}
      <p
        className={`text-center text-2xl font-bold leading-10 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-[#929090]'
        }`}
      >
        {boxData.title}
      </p>

      {/* Description (only visible when active) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-center text-base font-normal leading-relaxed text-[#b3b3b3]">
          {boxData.description}
        </p>
      </div>
    </div>
  );
}

// Mobile card component - active card with full details
interface MobileCardProps {
  content: BoxContent;
  isActive: boolean;
  onClick?: () => void;
}

function MobileCard({ content, isActive, onClick }: MobileCardProps) {
  const boxData = boxesData.find((box) => box.id === content)!;

  return (
    <div
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-col items-center gap-2.5 rounded-[15px] px-5 py-7 shadow-sm backdrop-blur-md transition-all duration-300`}
      style={{
        backgroundImage: isActive
          ? 'linear-gradient(203deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.85) 40%), linear-gradient(90deg, rgba(28, 28, 28, 0.7) 0%, rgba(28, 28, 28, 0.7) 100%)'
          : 'linear-gradient(198deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.3) 40%), linear-gradient(90deg, rgba(28, 28, 28, 0.3) 0%, rgba(28, 28, 28, 0.3) 100%)',
      }}
    >
      {/* Icon Container */}
      <div className="relative size-10">
        <div
          className={`absolute -inset-[15%] flex items-center justify-center rounded-lg border transition-all duration-300 ${
            isActive
              ? 'border-sealed-teal bg-sealed-teal/10'
              : 'border-[#7c7c7c] bg-white/5'
          }`}
        >
          <Image
            src="/assets/section_five/icon.svg"
            alt=""
            width={40}
            height={40}
            className={`transition-all duration-300 ${isActive ? 'brightness-100' : 'brightness-50'}`}
          />
        </div>
      </div>

      {/* Title */}
      <p
        className={`text-center text-2xl font-bold leading-10 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-[#929090]'
        }`}
      >
        {boxData.title}
      </p>

      {/* Description (only visible when active) */}
      {isActive && (
        <p className="text-center text-base font-normal leading-relaxed text-[#b3b3b3]">
          {boxData.description}
        </p>
      )}
    </div>
  );
}

// Mobile step-by-step view
interface MobileStepViewProps {
  currentStep: StepIndex;
  onStepChange: (step: StepIndex) => void;
}

function MobileStepView({ currentStep, onStepChange }: MobileStepViewProps) {
  const stepOrder: BoxContent[] = ['1', '2', '3', '4', '5'];
  const currentContent = stepOrder[currentStep];
  const nextStep = ((currentStep + 1) % 5) as StepIndex;
  const prevStep = ((currentStep - 1 + 5) % 5) as StepIndex;
  const nextContent = stepOrder[nextStep];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Handle scroll to detect when to advance to next step (touch devices only)
  useEffect(() => {
    if (!isTouchDevice) return;

    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      // Get container position relative to viewport
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Clear any pending timeout
      clearTimeout(scrollTimeout);

      // When scrolling down and the container is in view
      if (isScrollingDown && rect.top < viewportHeight * 0.3 && rect.bottom > viewportHeight * 0.5) {
        scrollTimeout = setTimeout(() => {
          if (currentStep < 4) {
            onStepChange(((currentStep + 1) % 5) as StepIndex);
          }
        }, 150);
      }
      // When scrolling up
      else if (!isScrollingDown && rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5) {
        scrollTimeout = setTimeout(() => {
          if (currentStep > 0) {
            onStepChange(((currentStep - 1 + 5) % 5) as StepIndex);
          }
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentStep, onStepChange, isTouchDevice]);

  return (
    <div ref={containerRef} className="relative">
      {/* Circle diagram - positioned behind cards */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 flex h-[280px] w-[280px] -translate-x-1/2 items-center justify-center">
        {/* Background circle */}
        <Image
          src="/assets/section_five/circle-bg.png"
          alt=""
          width={280}
          height={280}
          className="opacity-90"
          priority
        />

        {/* Cone Indicator */}
        <div className="pointer-events-none absolute inset-0">
          <ConeIndicator rotation={rotationAngles[currentContent]} />
        </div>

        {/* Left person */}
        <div className="absolute left-[25%] top-[8%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-9 items-center justify-center rounded-full border border-sealed-teal bg-sealed-teal/10 backdrop-blur-sm">
            <Image
              src="/assets/section_five/person.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
        </div>
        {/* Right person */}
        <div className="absolute left-[75%] top-[8%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-9 items-center justify-center rounded-full border border-sealed-teal bg-sealed-teal/10 backdrop-blur-sm">
            <Image
              src="/assets/section_five/person.svg"
              alt=""
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 100deg, rgba(0, 0, 0, 0.3) 130deg, rgba(0, 0, 0, 0.4) 180deg, rgba(0, 0, 0, 0.6) 220deg, rgba(0, 0, 0, 0.3) 260deg, transparent 290deg, transparent 360deg)',
          }}
        />
      </div>

      {/* Cards container - only shows current and next */}
      <div className="relative z-10 flex flex-col gap-4 px-1 pt-20">
        {/* Current active card - click to go back */}
        <MobileCard
          content={currentContent}
          isActive={true}
          onClick={() => onStepChange(prevStep)}
        />

        {/* Next card - click to advance */}
        <MobileCard
          content={nextContent}
          isActive={false}
          onClick={() => onStepChange(nextStep)}
        />

        {/* Step indicators */}
        <div className="mt-2 flex justify-center gap-2 pb-4">
          {stepOrder.map((_, index) => (
            <button
              key={index}
              onClick={() => onStepChange(index as StepIndex)}
              className={`size-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'scale-110 bg-sealed-teal'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Rotation angles for the triangle indicator based on active box
// 0° = pointing up, positive = clockwise
const rotationAngles: Record<BoxContent | 'default', number> = {
  '1': 60, // Top right
  '2': 120, // Bottom right
  '3': 180, // Bottom center
  '4': 235, // Bottom left
  '5': 295, // Top left
  default: 0,
};

// Large cone/wedge indicator with message icon at the tip
function ConeIndicator({ rotation }: { rotation: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-transform duration-500 ease-out"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 600 600"
        fill="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Gradient for the cone fill */}
          <linearGradient id="coneGradient" x1="50%" y1="50%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#6bfad6" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#6bfad6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6bfad6" stopOpacity="0.02" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="coneGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main cone/wedge shape - originates from center (300,300) pointing to top */}
        <path
          d="M 300 300 L 240 40 L 360 40 Z"
          fill="url(#coneGradient)"
          filter="url(#coneGlow)"
        />

        {/* Edge lines of the cone */}
        <line
          x1="300"
          y1="300"
          x2="240"
          y2="40"
          stroke="#6bfad6"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="300"
          y1="300"
          x2="360"
          y2="40"
          stroke="#6bfad6"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Message icon circle at the tip */}

        {/* Message icon inside the circle */}
        <rect
          x="288"
          y="22"
          width="24"
          className="absolute left-1/2 top-[15%] -translate-y-1/2"
          height="16"
          rx="2"
          fill="none"
          stroke="#63234bfad6"
          strokeWidth="1.5"
        />
        <path
          d="M 290 25 L 300 32 L 310 25"
          fill="none"
          stroke="#6bfad620"
          strokeWidth="1.520"
          strokeLinecap="round"
        />
      </svg>

      {/* Message bubble image at the tip */}
      <div
        className="absolute left-1/2 top-[8%]"
        style={{ transform: `translate(-40%, -60%) rotate(${-rotation}deg)` }}
      >
        <Image
          src="/assets/section_five/message_bubble.png"
          alt=""
          width={120}
          height={120}
          className="drop-shadow-[0_0_8px_rgba(107,250,214,0.4)]"
        />
      </div>
    </div>
  );
}

export default function SectionFive() {
  const [activeBox, setActiveBox] = useState<BoxContent | null>('1');
  const [mobileStep, setMobileStep] = useState<StepIndex>(0);

  // Get rotation angle for current active box
  const currentRotation = activeBox
    ? rotationAngles[activeBox]
    : rotationAngles['default'];

  return (
    <section className="relative mt-16 flex flex-col items-center gap-4 px-5 pt-0.5 lg:mt-24 lg:px-0">
      {/* Header */}
      <SectionHeader
        badgeIcon="/assets/icons/check-circle.svg"
        badgeText="How Sealed Works"
        title="Inside the Technology Behind Sealed"
        subtitle="how advanced cryptography and a serverless architecture work together to protect every message from interception or unauthorized access"
      />

      {/* Mobile Step-by-Step View - visible only on mobile/tablet */}
      <div className="mt-12 w-full lg:hidden">
        <MobileStepView currentStep={mobileStep} onStepChange={setMobileStep} />
      </div>

      {/* Desktop Interactive Diagram Container - hidden on mobile */}
      <div className="relative mt-12 hidden h-[900px] w-full max-w-[1600px] lg:block">
        {/* Central Circle Background */}
        <div className="absolute left-1/2 top-[200px] -translate-x-1/2">
          <Image
            src="/assets/section_five/circle-bg.png"
            alt=""
            width={600}
            height={600}
            className="opacity-90"
            priority
          />

          {/* Rotating Cone Indicator with message icon */}
          <ConeIndicator rotation={currentRotation} />

          {/* Person Icons - sitting on top of circle border */}
          {/* Left person - top-left-center */}
          <div className="absolute left-[30%] top-[10%] -translate-x-1/2 -translate-y-1/2">
            <div className="flex size-14 items-center justify-center rounded-full border border-sealed-teal bg-sealed-teal/10 backdrop-blur-sm">
              <Image
                src="/assets/section_five/person.svg"
                alt=""
                width={32}
                height={32}
              />
            </div>
          </div>
          {/* Right person - top-right-center */}
          <div className="absolute left-[70%] top-[10%] -translate-x-1/2 -translate-y-1/2">
            <div className="flex size-14 items-center justify-center rounded-full border border-sealed-teal bg-sealed-teal/10 backdrop-blur-sm">
              <Image
                src="/assets/section_five/person.svg"
                alt=""
                width={32}
                height={32}
              />
            </div>
          </div>

          {/* Gradient overlay - dim effect covering bottom-left to bottom-right area */}
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 100deg, rgba(0, 0, 0, 0.3) 130deg, rgba(0, 0, 0, 0.4) 180deg, rgba(0, 0, 0, 0.6) 220deg, rgba(0, 0, 0, 0.3) 260deg, transparent 290deg, transparent 360deg)',
            }}
          />
        </div>

        {/* Box 1 - Top Right: Secure exchange of access keys */}
        <div className="absolute right-[2%] top-[200px] xl:right-[-5%]">
          <Box
            content="1"
            isActive={activeBox === '1'}
            onHover={() => setActiveBox('1')}
            onLeave={() => setActiveBox(null)}
          />
        </div>

        {/* Box 5 - Top Left: Local decryption */}
        <div className="absolute left-[2%] top-[200px] xl:left-[-5%]">
          <Box
            content="5"
            isActive={activeBox === '5'}
            onHover={() => setActiveBox('5')}
            onLeave={() => setActiveBox(null)}
          />
        </div>

        {/* Box 2 - Bottom Right: End-to-end encryption */}
        <div className="absolute bottom-[80px] right-[2%] xl:right-[-5%]">
          <Box
            content="2"
            isActive={activeBox === '2'}
            onHover={() => setActiveBox('2')}
            onLeave={() => setActiveBox(null)}
          />
        </div>

        {/* Box 3 - Bottom Center: Submitting encrypted message */}
        <div className="absolute bottom-[-180px] left-1/2 -translate-x-1/2">
          <Box
            content="3"
            isActive={activeBox === '3'}
            onHover={() => setActiveBox('3')}
            onLeave={() => setActiveBox(null)}
          />
        </div>

        {/* Box 4 - Bottom Left: Data retrieval */}
        <div className="absolute bottom-[80px] left-[2%] xl:left-[-5%]">
          <Box
            content="4"
            isActive={activeBox === '4'}
            onHover={() => setActiveBox('4')}
            onLeave={() => setActiveBox(null)}
          />
        </div>
      </div>
    </section>
  );
}
