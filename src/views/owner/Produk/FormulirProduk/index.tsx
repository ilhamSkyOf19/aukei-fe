import InputChoose from "../../../../components/inputs/InputChoose";
import InputImg from "../../../../components/inputs/InputImg";
import InputNumber from "../../../../components/inputs/InputNumber";
import InputPrice from "../../../../components/inputs/InputPrice";
import InputTextNonIcon from "../../../../components/inputs/InputTextNonIcon";
import ButtonBackNonIcon from "../../../../components/ui/button/ButtonBackNonIcon";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";
import ButtonSubmit from "../../../../components/ui/button/ButtonSubmit";
import type {
  CreateProdukType,
  UpdateProdukType,
} from "../../../../models/produk.model";
import useFormulirProduk from "./useFormulirProduk";

const FormulirProduk = () => {
  // call use
  const {
    errors,
    fileController,
    register,
    kategoriController,
    dataKategori,
    isLoadingKategori,
    hargaBeliController,
    hargaJualController,
    handleSubmit,
    isPendingMutateProduk,
    onSubmit,
    isLoadingProdukDetail,
    dataProdukDetail,
  } = useFormulirProduk();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start px-2 lg:px-4">
      {/* content */}
      <div className="w-full card shadow-xs dark:border dark:border-base-content/10 flex mt-4 flex-col justify-start items-start bg-base-100 px-4 lg:px-6 py-4">
        {/* header formulir */}
        <div className="w-full flex flex-row lg:flex-col lg:justify-start lg:items-start lg:gap-4 relative justify-center items-center">
          {/* button kembali */}
          <div className="absolute lg:relative left-0">
            <ButtonBackText />
          </div>

          {/* title */}
          <div className="w-full flex flex-col justify-start lg:items-start items-center">
            {/* title */}
            <h2 className="text-sm lg:text-xl font-semibold text-base-content">
              Formulir Produk
            </h2>

            {/* keterangan */}
            <p className="text-xs lg:text-sm font-medium text-base-content/50">
              Silahkan isi formulir dibawah ini
            </p>
          </div>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-start items-start mt-8"
        >
          <div className="w-full flex flex-col justify-start items-start lg:flex-row lg:gap-6">
            {/* input img */}
            <div className="w-full h-60 lg:w-200 lg:h-105 mb-16 lg:mb-12">
              <InputImg<CreateProdukType | UpdateProdukType>
                controller={fileController}
                label="Foto Produk"
                name="img"
                {...(dataProdukDetail?.data?.img
                  ? {
                      required: false,
                    }
                  : {
                      required: true,
                    })}
              />
            </div>

            <div className="w-full flex flex-col justify-start items-start">
              {/* nama */}
              <InputTextNonIcon
                register={register("nama")}
                name="nama"
                placeholder="Nama Produk"
                label="Nama Produk"
                required
                max={100}
                errorMessage={errors?.nama?.message}
                defaultValue={dataProdukDetail?.data?.nama}
              />

              {/* kode produk */}
              <InputTextNonIcon
                register={register("kode")}
                name="kode"
                placeholder="Kode Produk"
                label="Kode Produk"
                required
                max={50}
                errorMessage={errors?.kode?.message}
                defaultValue={dataProdukDetail?.data?.kode}
              />

              {/* kategori */}
              <InputChoose<CreateProdukType | UpdateProdukType>
                controller={kategoriController}
                label="Kategori Produk"
                chooseList={
                  dataKategori?.data
                    ? dataKategori.data.map((item) => ({
                        value: item.id,
                        label: item.nama,
                      }))
                    : []
                }
                required
                isLoading={isLoadingKategori}
                placeholder="Pilih kategori"
              />

              <div className="w-full flex flex-row justify-center items-center gap-2 lg:gap-6">
                {/* harga beli */}
                <InputPrice<CreateProdukType | UpdateProdukType>
                  controller={hargaBeliController}
                  label="Harga Beli Satuan"
                  placeholder="Harga Beli Satuan"
                  required
                />

                {/* harga jual  */}
                <InputPrice<CreateProdukType | UpdateProdukType>
                  controller={hargaJualController}
                  label="Harga Jual Satuan"
                  placeholder="Harga Jual Satuan"
                  required
                />
              </div>

              <div className="w-full flex flex-col justify-start items-start lg:flex-row lg:gap-6 lg:mt-4">
                {/* stok */}
                <InputNumber
                  register={register("stok", {
                    valueAsNumber: true,
                  })}
                  name="stok"
                  placeholder="Masukkan Stok"
                  label="Stok"
                  required
                  max={9999999999}
                  errorMessage={errors?.stok?.message}
                  defaultValue={dataProdukDetail?.data?.stok}
                />

                {/* isi per box */}
                <InputNumber
                  register={register("isiPerBox", {
                    valueAsNumber: true,
                  })}
                  name="isiPerBox"
                  placeholder="Isi Per Box"
                  label="Isi Per Box"
                  required
                  max={9999999999}
                  errorMessage={errors?.isiPerBox?.message}
                  defaultValue={dataProdukDetail?.data?.isiPerBox}
                />

                {/* stok minimum */}
                <InputNumber
                  register={register("stokMinimum", {
                    valueAsNumber: true,
                  })}
                  name="stokMinimum"
                  placeholder="Stok Minimum"
                  label="Stok Minimum"
                  required
                  max={9999999999}
                  errorMessage={errors?.stokMinimum?.message}
                  defaultValue={dataProdukDetail?.data?.isiPerBox}
                />
              </div>
            </div>
          </div>

          {/* button aksi */}
          <div className="w-full flex flex-row justify-end items-center gap-4 my-4">
            {/* button cancel */}
            <ButtonBackNonIcon label="Batal" />

            {/* button submit */}
            <ButtonSubmit
              isLoading={isPendingMutateProduk}
              disable={isPendingMutateProduk}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulirProduk;
