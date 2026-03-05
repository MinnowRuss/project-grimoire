import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center h-7 bg-offline font-ui text-[11px] tracking-[0.12em] uppercase text-parchment">
      ☁ Offline — Showing Cached Content
    </div>
  );
}
