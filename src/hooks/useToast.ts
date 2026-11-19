import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { Toast } from "../types/toast.type";

export const useToastAnimation = (
  duration: number = 3000,
  fadeOut: number = 500,
) => {
  const location = useLocation();
  const [toast, setToast] = useState<Toast | null>(null);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const toastType = location.state?.toast;

    // cegah toast muncul dua kali untuk navigasi yang sama
    if (!toastType || handledKeyRef.current === location.key) return;

    handledKeyRef.current = location.key;

    addToast(toastType);

    // hapus state tanpa menyentuh URL (tanpa argumen ke-3)
    window.history.replaceState({ ...window.history.state, usr: null }, "");
  }, [location.key, location.state]);

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

  const addToast = (type: string) => {
    // clear timer lama
    clearTimers();

    const id = Date.now();

    // set toast baru, reset animasi
    setToast({ id, type, isAnimationOut: false });

    // mulai timer animasi keluar
    fadeOutTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, isAnimationOut: true } : null));

      // hapus toast setelah animasi selesai
      removeTimerRef.current = setTimeout(() => {
        setToast(null);
      }, fadeOut);
    }, duration);
  };

  return { toast, handleSetToast: addToast };
};
