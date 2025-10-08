import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import MirrorPage from './pages/MirrorPage';
import GymPage from './pages/GymPage';

export type Page = 'home' | 'mirror' | 'gym';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');

  const navigate = (newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case 'mirror':
        return <MirrorPage onNavigateHome={() => navigate('home')} />;
      case 'gym':
        return <GymPage onNavigateHome={() => navigate('home')} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;