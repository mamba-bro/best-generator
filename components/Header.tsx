
import React from 'react';
import { CatIcon } from './icons/CatIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center py-4">
      <div className="inline-flex items-center gap-4">
        <CatIcon className="w-12 h-12 text-pink-400" />
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400 font-display">
          Catgirl Dream Studio
        </h1>
        <CatIcon className="w-12 h-12 text-cyan-400" />
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Craft your perfect companion. Select her features and let AI bring her to life!
      </p>
    </header>
  );
};

export default Header;
