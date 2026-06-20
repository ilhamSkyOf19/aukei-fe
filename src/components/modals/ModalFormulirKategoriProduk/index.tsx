import { type FC, type RefObject } from "react";
import { cn } from "../../../utils/cn";
import type { UpdateKategoriProdukType } from "../../../models/kategoriProduk.model";
import useFormulirKategoriProduk from "../../../hooks/useFormulirKategoriProduk";
import TitleModalFormulir from "../../ui/TitleModalFormulir";
import InputTextNonIcon from "../../inputs/InputTextNonIcon";
import InputTextAreaNonIcon from "../../inputs/InputTextAreaNonIcon";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonSubmit from "../../ui/button/ButtonSubmit";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataUpdate?: UpdateKategoriProdukType & { id: number };
};
const ModalFormulirKategoriProduk: FC<Props> = ({
  modalRef,
  handleCloseModal,
  dataUpdate,
}) => {
  const {
    errors,
    register,
    onSubmit,
    handleSubmit,
    isPendingMutateKategoriProduk,
    reset,
  } = useFormulirKategoriProduk({
    dataUpdate,
    handleCloseModal,
  });

  return (
    <dialog ref={modalRef} id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 lg:w-2/5 max-w-5xl bg-base-200 dark:border dark:border-base-content/10">
        <div className="w-full flex flex-col justify-start items-start">
          {/* title page */}
          <div className="w-full flex flex-row justify-start items-center">
            <TitleModalFormulir
              title="Formulir Kategori"
              keterangan={`Formulir untuk menambah Kategori Produk`}
            />
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex flex-col justify-start items-center mt-4 gap-2",
            )}
          >
            {/* nama */}
            <InputTextNonIcon
              register={register(`nama`)}
              label={`Nama Kategori`}
              max={100}
              name="nama"
              required={true}
              placeholder={`Masukan nama kategori`}
              errorMessage={errors.nama?.message}
              defaultValue={dataUpdate?.nama}
            />

            {/* keterangan */}
            <InputTextAreaNonIcon
              register={register(`keterangan`)}
              label={`Keterangan Kategori (Opsional)`}
              max={100}
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
                  handleCloseModal();
                  reset();
                }}
              />
              {/* button submit */}
              <ButtonSubmit
                label={`Simpan`}
                isLoading={isPendingMutateKategoriProduk}
              />
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalFormulirKategoriProduk;
