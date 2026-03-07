import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { AuthGuard } from './components/layout/AuthGuard';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NavBar } from './components/layout/NavBar';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { FeedsPage } from './pages/FeedsPage';
import { AddFeedPage } from './pages/AddFeedPage';

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <OfflineBanner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Protected app routes */}
        <Route path="/app" element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route
              index
              element={
                <>
                  <NavBar />
                  <HomePage />
                </>
              }
            />
            <Route path="article/:id" element={<ArticlePage />} />
            <Route path="feeds" element={<FeedsPage />} />
            <Route path="feeds/add" element={<AddFeedPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
