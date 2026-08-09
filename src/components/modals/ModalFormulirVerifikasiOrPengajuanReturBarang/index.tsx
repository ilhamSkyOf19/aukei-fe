import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { CircleX, Hash, Send } from "lucide-react";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import AlertLabel from "../../messages/AlertLabel";
import type { RoleInternalType } from "../../../types/constant.type";
import useModalFormulirVerifikasiOrPengajuanReturBarang from "./useModalFormulirVerifikasiOrPengajuanReturBarang";
import ButtonText from "../../ui/button/ButtonText";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  returId?: number;
  kodeReferensi?: string;
  role?: RoleInternalType;
  type?: "tolak" | "pengajuan";
  handleSetAlert?: (data: string) => void;
};

const ModalFormulirVerifikasiOrPengajuanReturBarang: FC<Props> = ({
  modalRef,
  handleCloseModal,
  kodeReferensi,
  role,
  type,
  handleSetAlert,
  returId,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isPendingPengajuan,
    isPendingVerifikasi,
  } = useModalFormulirVerifikasiOrPengajuanReturBarang({
    kodeReferensi,
    handleCloseModal,
    returId,
    role,
    handleSetAlert,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 md:w-2/3 lg:w-2/5 max-w-5xl rounded-2xl md:rounded-xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={
                type === "tolak"
                  ? "Formulir Tolak Pengajuan"
                  : "Formulir Pengajuan"
              }
              keterangan={`Formulir untuk ${type === "tolak" ? "menolak" : ""} pengajuan retur barang`}
              withIcon={{
                icon: type === "tolak" ? CircleX : Send,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4",
            )}
          >
            <div className="w-full flex flex-col justify-start items-start gap-6 mb-4">
              {/* kode referensi */}
              <div className="w-full flex flex-row justify-start items-center gap-4">
                {/* icon */}
                <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-info/10">
                  <Hash className="text-info size-5" />
                </div>

                {/* label */}
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-base-content/50 font-medium text-xs">
                    Kode Referensi
                  </span>

                  <span className="text-info font-semibold text-sm">
                    {kodeReferensi}
                  </span>
                </div>
              </div>

              {/* status */}
              <div className="w-full flex flex-row justify-start items-center gap-4">
                {/* icon */}
                <div
                  className={cn(
                    "w-10 h-10 flex justify-center items-center rounded-lg",
                    type === "tolak" ? "bg-error/10" : "bg-emerald-100",
                  )}
                >
                  {type === "tolak" ? (
                    <CircleX className="text-error size-5" />
                  ) : (
                    <Send className="text-emerald-600 size-5" />
                  )}
                </div>

                {/* label */}
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-base-content/50 font-medium text-xs">
                    Status
                  </span>

                  <span
                    className={cn(
                      " font-semibold text-sm",
                      type === "tolak" ? "text-error" : "text-emerald-600",
                    )}
                  >
                    {type === "tolak" ? "Ditolak" : "Diajukan"}
                  </span>
                </div>
              </div>
            </div>

            {/* keterangan */}
            <InputTextAreaNonIcon
              register={register(`keterangan`, {
                setValueAs: (value) =>
                  value.trim() === "" ? undefined : value,
              })}
              label={`Keterangan ${type === "tolak" ? "" : "(Opsional)"}`}
              max={300}
              name="keterangan"
              required={type === "tolak"}
              placeholder={`Masukan keterangan`}
              rows={8}
              errorMessage={errors.keterangan?.message}
            />

            {/* alert */}
            <AlertLabel
              message={cn(
                type === "tolak"
                  ? "Pastikan data sudah benar. Setelah diverifikasi, keputusan tidak dapat diubah. Perubahan hanya dapat dilakukan setelah pegawai mengajukan ulang."
                  : "Setelah diajukan, data tidak dapat diubah. Perubahan hanya dapat dilakukan jika pengajuan ditolak oleh Owner.",
              )}
            />

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
              />
              {/* button submit */}
              <ButtonText
                label={type === "tolak" ? `Verifikasi` : "Ajukan"}
                isLoading={isPendingPengajuan || isPendingVerifikasi}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirVerifikasiOrPengajuanReturBarang;
