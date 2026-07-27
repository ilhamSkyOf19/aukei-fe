import React, { useEffect, useState, type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { RefreshCcw } from "lucide-react";

type Props = {
  handleRefresh: () => Promise<void>;
};

const ButtonRefresh: FC<Props> = ({ handleRefresh }) => {
  const REFRESH_INTERVAL = 5000;

  const [cooldown, setCooldown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const Refresh = async () => {
    if (isRefreshing || cooldown > 0) return;

    setIsRefreshing(true);

    try {
      await handleRefresh();
      setCooldown(5);
    } catch (error) {
      // set toast error
    } finally {
      setIsRefreshing(false);

      //   set toast success
    }
  };

  return (
    <>
      {/* global loading */}
      {isRefreshing && (
        <div className="flex-col gap-2.5 absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
          <span className="loading loading-spinner loading-xl text-custom-secondary" />
          <span className="text-custom-secondary text-xs">
            Sedang mengambil data
          </span>
        </div>
      )}

      <ButtonWithIcon
        bgColor="bg-info"
        textColor="text-primary-white"
        icon={RefreshCcw}
        label="Refresh"
        disabled={isRefreshing || cooldown > 0}
        handleBtn={Refresh}
        isLoading={isRefreshing}
      />
    </>
  );
};

export default ButtonRefresh;
