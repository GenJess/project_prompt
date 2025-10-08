import React from 'react';
import { GlowCard } from '../components/ui/spotlight-card';
import type { Page } from '../App';
import Hyperspeed from '../components/ui/Hyperspeed';
import { hyperspeedPresets } from '../components/ui/hyperspeedPresets';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Hyperspeed effectOptions={hyperspeedPresets.four} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.15),transparent_50%)] blur-[60px]"
        />
        <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-100 tracking-tighter">
                Promptry
            </h1>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div onClick={() => onNavigate('mirror')} className="cursor-pointer">
                    <GlowCard glowColor="yellow" className="p-8 flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl font-bold text-white">Mirror</h2>
                        <p className="mt-2 text-gray-400 max-w-xs">
                            (detailed exact json prompts to recreate an image)
                        </p>
                    </GlowCard>
                </div>
                <div onClick={() => onNavigate('gym')} className="cursor-pointer">
                    <GlowCard glowColor="purple" className="p-8 flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl font-bold text-white">Gym</h2>
                        <p className="mt-2 text-gray-400 max-w-xs">
                           (exercise your prompting skills & become fluent in llm)
                        </p>
                    </GlowCard>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;