import { type FC, type RefObject } from "react";
import type {
  CreateBarangMasukForRequestType,
  UpdateBarangMasukForRequestType,
} from "../../../models/barangMasuk.model";
import useFormulirBarangMasuk from "../../../hooks/useFormulirBarangMasuk";
import ModalFormulirBarangMasukOrKeluar from "../../modals/ModalFormulirBarangMasukOrKeluar";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataUpdate?: {
    id: number;
    tanggalMasuk: string;
    keterangan?: string;
  };
};

const FormulirBarangMasuk: FC<Props> = ({
  handleCloseModal,
  modalRef,
  dataUpdate,
}) => {
  // use formulir tambah barang masuk
  const {
    errors,
    handleCloseModalWithReset,
    handleSubmit,
    isPendingBarangMasuk,
    onSubmit,
    register,
    useTanggalMasukController,
  } = useFormulirBarangMasuk({ handleCloseModal, dataUpdate });

  return (
    <ModalFormulirBarangMasukOrKeluar<
      CreateBarangMasukForRequestType | UpdateBarangMasukForRequestType
    >
      modalRef={modalRef}
      handleCloseModalWithReset={handleCloseModalWithReset}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register("keterangan")}
      useTanggalController={useTanggalMasukController}
      isPending={isPendingBarangMasuk}
      errorKeteranganMessage={errors?.keterangan?.message}
      {...(dataUpdate && {
        dataUpdate: {
          id: dataUpdate.id,
          tanggal: dataUpdate.tanggalMasuk,
          keterangan: dataUpdate?.keterangan,
        },
      })}
      bigTitle="Formulir Tambah Barang Masuk"
      smallTitle="Formulir untuk menambah Barang Masuk"
    />
  );
};

export default FormulirBarangMasuk;
