import { type FC, type RefObject } from "react";
import ModalFormulirBarangMasukOrKeluar from "../../modals/ModalFormulirBarangMasukOrKeluar";
import useFormulirBarangKeluar from "../../../hooks/useFormulirBarangKeluar";
import type {
  CreateBarangKeluarForRequestType,
  UpdateBarangKeluarForRequestType,
} from "../../../models/barangKeluar.model";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  dataUpdate?: {
    id: number;
    tanggalKeluar: string;
    keterangan?: string;
  };
};

const FormulirBarangKeluar: FC<Props> = ({ handleCloseModal, modalRef }) => {
  // use formulir tambah barang masuk
  const {
    errors,
    handleCloseModalWithReset,
    handleSubmit,
    isPendingBarangKeluar,
    onSubmit,
    register,
    useTanggalKeluarController,
    useJenisKeluarController,
    isLoadingJenisKeluar,
    dataJenisKeluarForChoose,
  } = useFormulirBarangKeluar({ handleCloseModal });

  return (
    <ModalFormulirBarangMasukOrKeluar<
      CreateBarangKeluarForRequestType | UpdateBarangKeluarForRequestType
    >
      modalRef={modalRef}
      handleCloseModalWithReset={handleCloseModalWithReset}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register("keterangan")}
      useTanggalController={useTanggalKeluarController}
      useJenisKeluarController={useJenisKeluarController}
      dataJenisKeluar={dataJenisKeluarForChoose?.data?.map((item) => ({
        id: item.id,
        nama: item.nama,
      }))}
      isLoadingDataJenisKeluar={isLoadingJenisKeluar}
      isPending={isPendingBarangKeluar}
      errorKeteranganMessage={errors?.keterangan?.message}
      bigTitle="Tambah Barang Keluar"
      smallTitle="Formulir untuk menambah Barang Keluar"
    />
  );
};

export default FormulirBarangKeluar;
