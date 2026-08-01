import { type FC } from "react";
import ButtonWithIcon from "../../../../components/ui/button/ButtonWithIcon";
import { RefreshCcw } from "lucide-react";
import { useRefresh } from "../../../../hooks/useRefresh";

type Props = {
  handleRefresh: () => Promise<void>;
};

const ButtonRefresh: FC<Props> = ({ handleRefresh }) => {
  const { disabled, isLoading, refresh } = useRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <>
      {/* global loading */}
      {isLoading && (
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
        disabled={disabled}
        handleBtn={refresh}
        isLoading={isLoading}
      />
    </>
  );
};

export default ButtonRefresh;
