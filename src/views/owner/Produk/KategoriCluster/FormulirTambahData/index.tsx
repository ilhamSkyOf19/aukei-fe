import InputTextAreaNonIcon from "../../../../../components/inputs/InputTextAreaNonIcon";
import InputTextNonIcon from "../../../../../components/inputs/InputTextNonIcon";
import ButtonSubmit from "../../../../../components/ui/button/ButtonSubmit";
import useFormulirKategoriProduk from "../../../../../hooks/useFormulirKategoriProduk";

const FormulirTambahData = () => {
  // call use hook
  const {
    errors,
    handleSubmit,
    isPendingMutateKategoriProduk,
    onSubmit,
    register,
  } = useFormulirKategoriProduk({});

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="hidden lg:flex flex-1 card h-full bg-base-100 flex-col justify-start items-start p-4"
    >
      {/* header */}
      <div className="w-full flex flex-row justify-between items-center">
        {/* title */}
        <h2 className="text-base font-semibold text-base-content">
          Tambah Kategori
        </h2>

        {/* button submit */}
        <ButtonSubmit
          disable={isPendingMutateKategoriProduk}
          isLoading={isPendingMutateKategoriProduk}
        />
      </div>

      {/* input */}
      <div className="w-full flex flex-col justify-start items-start mt-8">
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
      </div>
    </form>
  );
};

export default FormulirTambahData;
