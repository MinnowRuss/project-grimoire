import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/layout/NavBar';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { FeedsPage } from './pages/FeedsPage';
import { AddFeedPage } from './pages/AddFeedPage';

function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <HomePage />
            </>
          }
        />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/feeds" element={<FeedsPage />} />
        <Route path="/feeds/add" element={<AddFeedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
