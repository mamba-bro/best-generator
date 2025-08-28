import React from 'react';
import type { Page } from '../../App';
import { CatIcon } from '../icons/CatIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
}> = ({ title, description, icon, onClick, colorClass }) => (
  <div
    onClick={onClick}
    className={`bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 border-2 border-transparent hover:border-${colorClass}`}
  >
    <div className={`mb-4 text-${colorClass}`}>
      {icon}
    </div>
    <h2 className="text-2xl font-bold font-display text-white mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 font-display mb-4">
        Welcome to the Dream Studio
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
        Your creative hub for generating unique AI-powered characters and art. Choose your canvas below to begin.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <FeatureCard
          title="Catgirl Generator"
          description="Craft your perfect catgirl from a vast array of detailed attributes."
          icon={<CatIcon className="w-16 h-16" />}
          onClick={() => onNavigate('catgirl')}
          colorClass="pink-400"
        />
        <FeatureCard
          title="Catboy Generator"
          description="Design a handsome and stylish catboy with unique features and personality."
          icon={<CatIcon className="w-16 h-16" />}
          onClick={() => onNavigate('catboy')}
          colorClass="cyan-400"
        />
        <FeatureCard
          title="Dream Remix"
          description="Upload any image and reimagine it with the power of generative AI."
          icon={<SparklesIcon className="w-16 h-16" />}
          onClick={() => onNavigate('remix')}
          colorClass="purple-400"
        />
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .hover\\:border-pink-400:hover { border-color: #f472b6; }
        .hover\\:border-cyan-400:hover { border-color: #22d3ee; }
        .hover\\:border-purple-400:hover { border-color: #a78bfa; }
        .text-pink-400 { color: #f472b6; }
        .text-cyan-400 { color: #22d3ee; }
        .text-purple-400 { color: #a78bfa; }
      `}</style>
    </div>
  );
};

export default HomePage;
