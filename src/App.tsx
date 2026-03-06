import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { AuthGuard } from './components/layout/AuthGuard';
import { AppLayout } from './components/layout/AppLayout';
import { RootRedirect } from './components/layout/RootRedirect';
import { LoginPage } from './pages/LoginPage';
import { NavBar } from './components/layout/NavBar';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { FeedsPage } from './pages/FeedsPage';
import { AddFeedPage } from './pages/AddFeedPage';

function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Root redirect: auth -> /app, no auth -> /login */}
        <Route path="/" element={<RootRedirect />} />

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
