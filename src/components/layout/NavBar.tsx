import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function NavBar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const isHome = location.pathname === '/app';

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 h-12 bg-crypt border-b border-iron">
      {isHome ? (
        <Link
          to="/app/feeds"
          className="flex items-center gap-1.5 text-gold hover:text-parchment transition-colors duration-200"
          aria-label="Manage feeds"
        >
          <span className="font-ornament text-base leading-none">✦</span>
          <span className="font-display text-[10px] tracking-[0.15em] uppercase">My Grimoire</span>
        </Link>
      ) : (
        <div className="w-5" />
      )}

      <button
        onClick={signOut}
        className="flex items-center gap-1.5 text-faded hover:text-parchment transition-colors duration-200"
        aria-label="Sign out"
      >
        <span className="font-ui text-[10px] tracking-[0.12em] uppercase">Logout</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </nav>
  );
}
