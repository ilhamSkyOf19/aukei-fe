import { CheckCircle2, ClockAlert, Inbox, RefreshCcw } from "lucide-react";
import type { FC } from "react";
import { cn } from "../../utils/cn";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../types/constant.type";

type Size = "xs";
type Props = {
  status?: StatusInventoriType | null | "";
  size?: Size;
};

// status
export const StatusComponent: FC<Props> = ({ status, size }) => {
  return (
    <>
      {status === STATUS_INVENTORI_TYPE.POSTED && <StatusPosted size={size} />}
      {status === STATUS_INVENTORI_TYPE.PENDING && (
        <StatusPending size={size} />
      )}
      {status === STATUS_INVENTORI_TYPE.REJECTED && (
        <StatusRejected size={size} />
      )}
      {status === STATUS_INVENTORI_TYPE.DRAFT && <StatusDraft size={size} />}
    </>
  );
};
export const StatusPending = ({ size }: { size?: Size }) => {
  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-600`,
        size === "xs" ? "px-2.5 py-1.5" : "px-3 py-2",
      )}
    >
      <ClockAlert size={size === "xs" ? 14 : 16} />
      <span className={cn(size === "xs" ? "text-[0.625rem]" : "text-xs")}>
        Menunggu
      </span>
    </div>
  );
};

export const StatusRejected = ({ size }: { size?: Size }) => {
  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-600`,
        size === "xs" ? "px-2.5 py-1.5" : "px-3 py-2",
      )}
    >
      <RefreshCcw size={size === "xs" ? 14 : 16} />
      <span className={cn(size === "xs" ? "text-[0.625rem]" : "text-xs")}>
        Ditolak
      </span>
    </div>
  );
};

type StatusPostedProps = {
  label?: string;
  size?: Size;
};

export const StatusPosted: FC<StatusPostedProps> = ({ size, label }) => {
  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-600`,
        size === "xs" ? "px-2.5 py-1.5" : "px-3 py-2",
      )}
    >
      <CheckCircle2 size={size === "xs" ? 14 : 16} />
      <span className={cn(size === "xs" ? "text-[0.625rem]" : "text-xs")}>
        {label ? label : STATUS_INVENTORI_TYPE.POSTED}
      </span>
    </div>
  );
};

type StatusDraftProps = {
  label?: string;
  size?: Size;
};

export const StatusDraft: FC<StatusDraftProps> = ({ label, size }) => {
  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-sky-100 text-sky-600`,
        size === "xs" ? "px-2.5 py-1.5" : "px-3 py-2",
      )}
    >
      <Inbox size={size === "xs" ? 14 : 16} />
      <span className={cn(size === "xs" ? "text-[0.625rem]" : "text-xs")}>
        {label ?? "Kosong"}
      </span>
    </div>
  );
};
