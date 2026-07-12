import { type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import { InputDate } from "../../inputs/InputDate";
import type {
  FieldValues,
  UseControllerReturn,
  UseFormHandleSubmit,
  UseFormRegisterReturn,
} from "react-hook-form";
import type { IJenisKeluarType } from "../../../models/jenisKeluar.model";
import InputChoose from "../../inputs/InputChoose";
type Props<T extends FieldValues> = {
  modalRef: RefObject<HTMLDialogElement | null>;
  errorKeteranganMessage?: string;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: (data: T) => Promise<void>;
  isPending?: boolean;
  register: UseFormRegisterReturn;
  useTanggalController: UseControllerReturn<T>;
  useJenisKeluarController?: UseControllerReturn<T>;
  dataJenisKeluar?: Pick<IJenisKeluarType, "id" | "nama">[];
  isLoadingDataJenisKeluar?: boolean;
  handleCloseModalWithReset: () => void;
  dataUpdate?: {
    id: number;
    tanggal: string;
    keterangan?: string;
  };
  bigTitle: string;
  smallTitle: string;
};

const ModalFormulirBarangMasukOrKeluar = <T extends FieldValues>({
  modalRef,
  handleCloseModalWithReset,
  handleSubmit,
  onSubmit,
  register,
  useTanggalController,
  useJenisKeluarController,
  dataJenisKeluar,
  errorKeteranganMessage,
  isPending,
  bigTitle,
  smallTitle,
  isLoadingDataJenisKeluar,
}: Props<T>) => {
  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-1/2 max-w-5xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir title={bigTitle} keterangan={smallTitle} />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-start mt-4 gap-4",
            )}
          >
            <div className="w-full flex flex-row justify-start items-start gap-4">
              {/* tanggal masuk */}
              <div className="flex-1 border-r border-base-content/10">
                <InputDate<T>
                  controller={useTanggalController}
                  label="Tanggal Masuk"
                />
              </div>

              <div className="flex-1 flex flex-col justify-end items-start">
                {/* input choose jenis keluar */}
                {useJenisKeluarController && (
                  <InputChoose<T>
                    chooseList={
                      dataJenisKeluar?.map((item) => ({
                        label: item.nama,
                        value: item.id,
                      })) ?? []
                    }
                    controller={useJenisKeluarController}
                    label="Jenis Keluar"
                    placeholder="Pilih Jenis Keluar"
                    required
                    isLoading={isLoadingDataJenisKeluar}
                  />
                )}

                {/* keterangan */}
                <InputTextAreaNonIcon
                  register={register}
                  label={`Keterangan Kategori (Opsional)`}
                  max={300}
                  name="keterangan"
                  placeholder={`Masukan keterangan kategori`}
                  errorMessage={errorKeteranganMessage}
                  rows={8}
                />
              </div>
            </div>

            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModalWithReset();
                }}
              />
              {/* button submit */}
              <ButtonSubmit label={`Simpan`} isLoading={isPending} />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirBarangMasukOrKeluar;
