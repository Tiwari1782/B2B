// Fixed: P2-18 (timer cleanup — use refs for all setTimeout IDs)
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LoaderContext = createContext(null);

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider');
  return ctx;
};

export const LoaderProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true);       // Phase 1: 3D cube
  const [isSkeleton, setSkeleton] = useState(false);     // Phase 2: skeleton
  const location = useLocation();
  const isFirstLoad = useRef(true);
  const cubeTimerRef = useRef(null);
  const skelTimerRef = useRef(null);

  // Helper to clear both timers
  const clearTimers = () => {
    if (cubeTimerRef.current) clearTimeout(cubeTimerRef.current);
    if (skelTimerRef.current) clearTimeout(skelTimerRef.current);
    cubeTimerRef.current = null;
    skelTimerRef.current = null;
  };

  // Chain: cube finishes → skeleton starts → skeleton finishes
  useEffect(() => {
    clearTimers();

    if (isFirstLoad.current) {
      // Initial page load — cube 1.2s → skeleton 1.5s
      isFirstLoad.current = false;
      cubeTimerRef.current = setTimeout(() => {
        setLoading(false);
        setSkeleton(true);
        skelTimerRef.current = setTimeout(() => setSkeleton(false), 1500);
      }, 1200);
      return clearTimers;
    }

    // Subsequent navigations — cube 700ms → skeleton 1.2s
    setLoading(true);
    setSkeleton(false);
    cubeTimerRef.current = setTimeout(() => {
      setLoading(false);
      setSkeleton(true);
      skelTimerRef.current = setTimeout(() => setSkeleton(false), 1200);
    }, 700);
    return clearTimers;
  }, [location.pathname]);

  const showLoader = useCallback((duration = 700) => {
    clearTimers();
    setLoading(true);
    setSkeleton(false);
    cubeTimerRef.current = setTimeout(() => {
      setLoading(false);
      setSkeleton(true);
      skelTimerRef.current = setTimeout(() => setSkeleton(false), 1200);
    }, duration);
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, isSkeleton, setLoading, setSkeleton, showLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
