import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Alert } from "../types/alert.types";

export const useAlertAnimation = (
  duration: number = 3000,
  fadeOut: number = 2000,
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alert, setAlert] = useState<Alert | null>(null);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (location.state?.alert) {
      addAlert(location.state.alert);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname]);

  // cleanup saat unmount
  useEffect(() => {
    return () => {
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
      if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    };
  }, []);

  const clearTimers = () => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    if (removeTimerRef.current) {
      clearTimeout(removeTimerRef.current);
      removeTimerRef.current = null;
    }
  };

  const addAlert = (type: string) => {
    // clear timer lama
    clearTimers();

    const id = Date.now();

    // set Alert baru, reset animasi
    setAlert({ id, type, isAnimationOut: false });

    // mulai timer animasi keluar
    fadeOutTimerRef.current = setTimeout(() => {
      setAlert((prev) => (prev ? { ...prev, isAnimationOut: true } : null));

      // hapus Alert setelah animasi selesai
      removeTimerRef.current = setTimeout(() => {
        setAlert(null);
      }, fadeOut);
    }, duration);
  };

  return { alert, handleSetAlert: addAlert };
};
