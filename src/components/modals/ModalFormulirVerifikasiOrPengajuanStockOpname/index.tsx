import type { FC, RefObject } from "react";

import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";

import { CircleX, ClipboardCheck, Hash, Send } from "lucide-react";

import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import AlertLabel from "../../messages/AlertLabel";

import type { RoleInternalType } from "../../../types/constant.type";

import ButtonText from "../../ui/button/ButtonText";
import useModalFormulirVerifikasiOrPengajuanStockOpname from "./useModalFormulirVerifikasiOrPengajuanStockOpname";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;

  handleCloseModal: () => void;

  barangMasukId?: number;

  barangKeluarId?: number;

  stockOpnameId?: number;

  kodeReferensi: string;

  role?: RoleInternalType;

  type?: "tolak" | "pengajuan";

  handleSetAlert?: (data: string) => void;
};

const ModalFormulirVerifikasiOrPengajuanStockOpname: FC<Props> = ({
  modalRef,
  handleCloseModal,

  barangKeluarId,
  barangMasukId,
  stockOpnameId,

  kodeReferensi,
  role,
  type,
  handleSetAlert,
}) => {
  // ============================================================
  // DETERMINE JENIS PENGAJUAN
  // ============================================================

  const jenisPengajuan = stockOpnameId
    ? "stock opname"
    : barangMasukId
      ? "barang masuk"
      : "barang keluar";

  // ============================================================
  // CALL HOOK
  // ============================================================

  const {
    errors,

    handleSubmit,

    onSubmit,

    register,

    isPendingVerifikasiOrPengajuan,
  } = useModalFormulirVerifikasiOrPengajuanStockOpname({
    handleCloseModal,

    barangKeluarId,

    barangMasukId,

    stockOpnameId,

    role,

    type,

    handleSetAlert,
  });

  return (
    <dialog
      ref={modalRef}
      id="modal-formulir-verifikasi-pengajuan"
      className="modal"
    >
      <div
        className={cn(
          "modal-box",
          "w-11/12 lg:w-2/5",
          "max-w-5xl",
          "bg-base-100",
          "dark",
          "dark/10",
        )}
      >
        <div className="w-full flex flex-col justify-start items-start">
          {/* ====================================================== /}
{/ TITLE /}
{/ ====================================================== */}

          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={
                type === "tolak"
                  ? "Formulir Tolak Pengajuan"
                  : "Formulir Pengajuan"
              }
              keterangan={
                type === "tolak"
                  ? `Formulir untuk menolak pengajuan ${jenisPengajuan}`
                  : `Ajukan data ${jenisPengajuan} untuk diverifikasi`
              }
              withIcon={{
                icon: stockOpnameId
                  ? ClipboardCheck
                  : type === "tolak"
                    ? CircleX
                    : Send,
              }}
            />
          </div>

          {/* ====================================================== */}
          {/* FORM */}
          {/* ====================================================== */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full",
              "flex flex-col",
              "justify-start items-center",
              "mt-4",
            )}
          >
            <div
              className={cn(
                "w-full",
                "flex flex-col",
                "justify-start items-start",
                "gap-6",
                "mb-4",
              )}
            >
              {/* ================================================== */}
              {/* KODE REFERENSI */}
              {/* ================================================== */}

              <div
                className={cn(
                  "w-full",
                  "flex flex-row",
                  "justify-start items-center",
                  "gap-4",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10",
                    "flex justify-center items-center",
                    "rounded-lg",
                    "bg-info/10",
                  )}
                >
                  <Hash className="text-info size-5" />
                </div>

                <div
                  className={cn(
                    "flex flex-col",
                    "justify-start items-start",
                    "gap-1",
                  )}
                >
                  <span className="text-base-content/50 font-medium text-xs">
                    Kode Referensi
                  </span>

                  <span className="text-info font-semibold text-sm">
                    {kodeReferensi}
                  </span>
                </div>
              </div>

              {/* ================================================== */}
              {/* STATUS */}
              {/* ================================================== */}

              <div
                className={cn(
                  "w-full",
                  "flex flex-row",
                  "justify-start items-center",
                  "gap-4",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10",
                    "flex justify-center items-center",
                    "rounded-lg",
                    type === "tolak" ? "bg-error/10" : "bg-emerald-100",
                  )}
                >
                  {type === "tolak" ? (
                    <CircleX className="text-error size-5" />
                  ) : (
                    <Send className="text-emerald-600 size-5" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex flex-col",
                    "justify-start items-start",
                    "gap-1",
                  )}
                >
                  <span className="text-base-content/50 font-medium text-xs">
                    Status
                  </span>

                  <span
                    className={cn(
                      "font-semibold text-sm",
                      type === "tolak" ? "text-error" : "text-emerald-600",
                    )}
                  >
                    {type === "tolak" ? "Ditolak" : "Diajukan"}
                  </span>
                </div>
              </div>
            </div>

            {/* ====================================================== */}
            {/* KETERANGAN */}
            {/* ====================================================== */}

            <InputTextAreaNonIcon
              register={register("keterangan", {
                setValueAs: (value) =>
                  value.trim() === "" ? undefined : value,
              })}
              label={`Keterangan ${type === "tolak" ? "" : "(Opsional)"}`}
              max={300}
              name="keterangan"
              required={type === "tolak"}
              placeholder={
                type === "tolak"
                  ? "Masukkan alasan penolakan"
                  : "Masukkan keterangan pengajuan"
              }
              rows={8}
              errorMessage={errors.keterangan?.message}
            />

            {/* ====================================================== */}
            {/* ALERT */}
            {/* ====================================================== */}

            <AlertLabel
              message={
                type === "tolak"
                  ? "Pastikan data sudah benar. Data yang ditolak dapat diperbaiki dan diajukan kembali."
                  : "Setelah diajukan, data Stock Opname tidak dapat diubah sampai Owner melakukan verifikasi."
              }
            />

            {/* ====================================================== */}
            {/* ACTION */}
            {/* ====================================================== */}

            <div
              className={cn(
                "w-full",
                "mt-6",
                "flex flex-row",
                "justify-end items-center",
                "gap-4",
              )}
            >
              <ButtonCloseText
                handleClose={handleCloseModal}
                disabled={isPendingVerifikasiOrPengajuan}
              />

              <ButtonText
                label={type === "tolak" ? "Tolak" : "Ajukan"}
                isLoading={isPendingVerifikasiOrPengajuan}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirVerifikasiOrPengajuanStockOpname;
