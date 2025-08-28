
import React, { useState } from 'react';
import HomePage from './components/pages/HomePage';
import CatgirlGeneratorPage from './components/pages/CatgirlGeneratorPage';
import CatboyGeneratorPage from './components/pages/CatboyGeneratorPage';
import ImageRemixPage from './components/pages/ImageRemixPage';
import Header from './components/Header';

export type Page = 'home' | 'catgirl' | 'catboy' | 'remix';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'catgirl':
        return <CatgirlGeneratorPage onBack={() => navigateTo('home')} />;
      case 'catboy':
        return <CatboyGeneratorPage onBack={() => navigateTo('home')} />;
      case 'remix':
        return <ImageRemixPage onBack={() => navigateTo('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
