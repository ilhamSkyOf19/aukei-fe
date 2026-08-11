import { type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import { InputDate } from "../../inputs/InputDate";
import type {
  FieldValues,
  UseControllerReturn,
  UseFormHandleSubmit,
  UseFormRegisterReturn,
} from "react-hook-form";
import type { IJenisKeluarType } from "../../../models/jenisKeluar.model";
import InputChoose from "../../inputs/InputChoose";
import { Truck } from "lucide-react";
import ButtonText from "../../ui/button/ButtonText";
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
      <div className="modal-box w-11/12 lg:w-1/2 max-w-5xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin rounded-2xl md:rounded-xl">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title={bigTitle}
              keterangan={smallTitle}
              withIcon={{
                icon: Truck,
              }}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-start mt-4 gap-4",
            )}
          >
            <div className="w-full flex md:flex-row flex-col justify-start items-start gap-4">
              {/* tanggal masuk */}
              <div className="flex-1 md:border-r md:border-base-content/10">
                <InputDate<T>
                  controller={useTanggalController}
                  label="Tanggal Masuk"
                />
              </div>

              <div className="md:flex-1 w-full flex flex-col justify-end items-start">
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

                <div className="w-full flex flex-row justify-end items-center gap-2.5">
                  {/* button close */}
                  <ButtonCloseText
                    handleClose={() => {
                      handleCloseModalWithReset();
                    }}
                    disabled={isPending}
                  />
                  {/* button submit */}
                  <ButtonText label={`Simpan`} isLoading={isPending} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirBarangMasukOrKeluar;
