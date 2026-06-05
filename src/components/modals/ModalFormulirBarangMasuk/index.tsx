import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
import useFormulirBarangMasuk from "../../../hooks/useFormulirBarangMasuk";
import { InputDate } from "../../inputs/InputDate";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataUpdate?: {
    id: number;
    tanggalMasuk: string;
    keterangan?: string;
  };
};

const ModalFormulirBarangMasuk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  dataUpdate,
}) => {
  const {
    errors,
    register,
    onSubmit,
    handleSubmit,
    isPendingBarangMasuk,
    useTanggalMasukController,
    handleCloseModalWithReset,
  } = useFormulirBarangMasuk({
    handleCloseModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl max-h-[90vh] bg-base-200 dark:border dark:border-base-content/10 scrollbar-thin">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Barang Masuk"
              keterangan={`Formulir untuk menambah Barang Masuk`}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4 gap-4",
            )}
          >
            {/* nama */}
            <InputDate
              controller={useTanggalMasukController}
              label="Tanggal Masuk"
            />

            {/* keterangan */}
            <InputTextAreaNonIcon
              register={register(`keterangan`)}
              label={`Keterangan Kategori (Opsional)`}
              max={300}
              name="keterangan"
              placeholder={`Masukan keterangan kategori`}
              errorMessage={errors.keterangan?.message}
              defaultValue={dataUpdate?.keterangan}
              rows={4}
            />
            {/* action */}
            <div className="w-full mt-6 flex flex-row justify-end items-center gap-4">
              {/* button close */}
              <ButtonCloseText
                handleClose={() => {
                  handleCloseModalWithReset();
                }}
              />
              {/* button submit */}
              <ButtonSubmit label={`Simpan`} isLoading={isPendingBarangMasuk} />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirBarangMasuk;
