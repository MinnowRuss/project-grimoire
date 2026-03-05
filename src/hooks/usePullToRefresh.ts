import { useRef, useEffect, useState, useCallback } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: PullToRefreshOptions) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPullDistance(0);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        setPulling(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling || refreshing) return;
      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      // Apply resistance — diminishing returns past threshold
      const resistedDistance = distance > threshold
        ? threshold + (distance - threshold) * 0.3
        : distance;
      setPullDistance(resistedDistance);
    };

    const onTouchEnd = () => {
      if (!pulling) return;
      setPulling(false);
      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [pulling, pullDistance, refreshing, threshold, handleRefresh]);

  const progress = Math.min(1, pullDistance / threshold);

  return { pullDistance, refreshing, progress };
}
