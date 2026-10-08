import { type FC } from "react";
import { History } from "lucide-react";
import useResend from "./useResend";
import TimeComponent from "../../../../components/Timer";

const Resend: FC = () => {
  // call use
  const {
    handleResendEmail,
    isPendingResendEmail,
    expiredAt,
    isDisabled,
    handleDisable,
  } = useResend();

  return (
    <div className="w-full flex flex-col justify-start items-center mb-1">
      <div className="w-full flex flex-row justify-evenly items-center gap-2">
        <div className="h-px w-1/4 bg-base-content/10" />
        <p className="text-xs text-base-content">Tidak menerima kode?</p>
        <div className="h-px w-1/4 bg-base-content/10" />
      </div>

      {isDisabled ? (
        <div className="w-80 flex flex-row justify-between items-center py-3 px-12 bg-primary-purple/10 rounded-md gap-2 my-4">
          <div className="flex flex-row justify-center items-center gap-3">
            <History className="text-base-content size-6" />
            <p className="text-base-content text-sm">Kirim kode dalam</p>
          </div>
          {isDisabled && expiredAt && (
            <TimeComponent
              expiredAt={expiredAt?.toString()}
              onFinished={() => handleDisable()}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          className="text-base-content text-sm font-semibold my-4"
          onClick={() => handleResendEmail()}
          disabled={isPendingResendEmail}
        >
          {isPendingResendEmail ? (
            <div className="loading loading-md text-base-content" />
          ) : (
            "Kirim kode ulang"
          )}
        </button>
      )}
    </div>
  );
};

export default Resend;
