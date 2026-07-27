import type { FC } from "react";
import InputTextAreaNonIcon from "../../../../../components/inputs/InputTextAreaNonIcon";
import InputTextNonIcon from "../../../../../components/inputs/InputTextNonIcon";
import useFormulirKategoriProduk from "../../../../../hooks/useFormulirKategoriProduk";
import ButtonText from "../../../../../components/ui/button/ButtonText";

type Props = {
  handleSetToast: (toast: string) => void;
};
const FormulirTambahData: FC<Props> = ({ handleSetToast }) => {
  // call use hook
  const {
    errors,
    handleSubmit,
    isPendingMutateKategoriProduk,
    onSubmit,
    register,
  } = useFormulirKategoriProduk({ handleSetToast });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="hidden lg:flex flex-1 rounded-xl h-full bg-base-100 flex-col justify-start items-start p-4 dark:border dark:border-base-content/10"
    >
      {/* header */}
      <div className="w-full flex flex-row justify-between items-center">
        {/* title */}
        <h2 className="text-sm font-semibold text-base-content">
          Tambah Kategori
        </h2>
      </div>

      {/* input */}
      <div className="w-full flex flex-col justify-start items-start mt-2.5">
        {/* input nama */}
        <InputTextNonIcon
          register={register("nama")}
          name="nama"
          placeholder="Masukkan Nama Kategori"
          label="Nama Kategori"
          required
          errorMessage={errors?.nama?.message}
          max={100}
        />

        {/* input keterangan */}
        <InputTextAreaNonIcon
          register={register("keterangan")}
          name="keterangan"
          placeholder="Masukkan Keterangan Kategori"
          label="Keterangan Kategori (Opsional)"
          errorMessage={errors?.keterangan?.message}
          max={100}
          rows={8}
        />

        {/* button submit */}
        <ButtonText
          label="Simpan"
          disable={isPendingMutateKategoriProduk}
          isLoading={isPendingMutateKategoriProduk}
          customWidth="w-full"
        />
      </div>
    </form>
  );
};

export default FormulirTambahData;
