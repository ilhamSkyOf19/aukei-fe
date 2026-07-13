import type { FC, RefObject } from "react";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import useModalFormulirVerifikasiRejected from "./useModalFormulirVerifikasiRejected";
import { CircleX, Hash } from "lucide-react";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import AlertLabel from "../../messages/AlertLabel";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  barangMasukId?: number;
  barangKeluarId?: number;
  kodeReferensi: string;
};

const ModalFormulirVerifikasiRejected: FC<Props> = ({
  modalRef,
  handleCloseModal,
  barangKeluarId,
  barangMasukId,
  kodeReferensi,
}) => {
  // call use
  const {
    errors,
    handleSubmit,
    onSubmit,
    register,
    isPendingVerifikasiRejected,
  } = useModalFormulirVerifikasiRejected({
    handleCloseModal,
    barangKeluarId,
    barangMasukId,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl bg-base-100 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Tolak Pengajuan"
              keterangan={`Formulir untuk menolak pengajuan ${barangMasukId ? "barang masuk" : "barang keluar"} `}
              withIcon={{
                icon: CircleX,
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
                <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-error/10">
                  <CircleX className="text-error size-5" />
                </div>

                {/* label */}
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-base-content/50 font-medium text-xs">
                    Status
                  </span>

                  <span className="text-error font-semibold text-sm">
                    Ditolak
                  </span>
                </div>
              </div>
            </div>

            {/* keterangan */}
            <InputTextAreaNonIcon
              register={register(`keterangan`)}
              label={`Keterangan`}
              max={300}
              name="keterangan"
              required={true}
              placeholder={`Masukan keterangan`}
              rows={8}
              errorMessage={errors.keterangan?.message}
            />

            {/* alert */}
            <AlertLabel message="Pastikan data sudah benar. Setelah diverifikasi, keputusan tidak dapat diubah. Perubahan hanya dapat dilakukan setelah pegawai mengajukan ulang." />

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModal();
                }}
              />
              {/* button submit */}
              <ButtonSubmit
                label={`Verifikasi`}
                isLoading={isPendingVerifikasiRejected}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirVerifikasiRejected;
