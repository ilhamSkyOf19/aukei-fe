import { useCallback, useEffect, useState } from "react";

type UseRefreshProps = {
  onRefresh: () => Promise<void>;
  cooldownSeconds?: number;
};

export const useRefresh = ({
  onRefresh,
  cooldownSeconds = 5,
}: UseRefreshProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const refresh = useCallback(async () => {
    if (isLoading || cooldown > 0) return;

    setIsLoading(true);

    try {
      await onRefresh();
      setCooldown(cooldownSeconds);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, cooldown, onRefresh, cooldownSeconds]);

  return {
    refresh,
    isLoading,
    cooldown,
    disabled: isLoading || cooldown > 0,
  };
};
