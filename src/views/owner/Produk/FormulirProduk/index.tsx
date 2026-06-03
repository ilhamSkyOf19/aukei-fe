import InputChoose from "../../../../components/inputs/InputChoose";
import InputImg from "../../../../components/inputs/InputImg";
import InputNumber from "../../../../components/inputs/InputNumber";
import InputPrice from "../../../../components/inputs/InputPrice";
import InputStatus from "../../../../components/inputs/InputStatus";
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
  } = useFormulirProduk();

  return (
    <div className="w-full mb-30 flex flex-col justify-start items-start px-2 lg:px-4">
      {/* content */}
      <div className="w-full card shadow-xs dark:border dark:border-base-content/10 flex mt-4 flex-col justify-start items-start bg-base-100 px-4 py-4">
        {/* header formulir */}
        <div className="w-full flex flex-row relative justify-center items-center">
          {/* button kembali */}
          <div className="absolute left-0">
            <ButtonBackText />
          </div>

          {/* title */}
          <div className="w-full flex flex-col justify-start items-center">
            {/* title */}
            <h2 className="text-sm font-semibold">Formulir Produk</h2>

            {/* keterangan */}
            <p className="text-xs lg:text-sm font-medium text-base-content/50">
              Silahkan isi formulir dibawah ini
            </p>
          </div>
        </div>

        {/* form */}
        <form className="w-full flex flex-col justify-start items-start mt-8">
          {/* input img */}
          <InputImg<CreateProdukType | UpdateProdukType>
            controller={fileController}
            label="Foto Produk"
            name="img"
            required
          />

          {/* nama */}
          <InputTextNonIcon
            register={register("nama")}
            name="name"
            placeholder="Nama Produk"
            label="Nama Produk"
            required
            max={100}
            errorMessage={errors?.nama?.message}
          />

          {/* kode produk */}
          <InputTextNonIcon
            register={register("kode")}
            name="kode"
            placeholder="Kode Produk"
            label="Kode Produk"
            required
            max={50}
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

          <div className="w-full flex flex-row justify-center items-center gap-2">
            {/* harga beli */}
            <InputPrice<CreateProdukType | UpdateProdukType>
              controller={hargaBeliController}
              label="Harga Beli"
              placeholder="Harga Beli"
              required
            />

            {/* harga jual  */}
            <InputPrice<CreateProdukType | UpdateProdukType>
              controller={hargaJualController}
              label="Harga Jual"
              placeholder="Harga Jual"
              required
            />
          </div>

          {/* stok */}
          <InputNumber
            register={register("stok")}
            name="stok"
            placeholder="Masukkan Stok"
            label="Stok"
            required
            max={9999999999}
            errorMessage={errors?.stok?.message}
          />

          {/* isi per box */}
          <InputNumber
            register={register("isiPerBox")}
            name="isiPerBox"
            placeholder="Isi Per Box"
            label="Isi Per Box"
            required
            max={9999999999}
            errorMessage={errors?.isiPerBox?.message}
          />

          {/* stok minimum */}
          <InputNumber
            register={register("stokMinimum")}
            name="stokMinimum"
            placeholder="Stok Minimum"
            label="Stok Minimum"
            required
            max={9999999999}
            errorMessage={errors?.stokMinimum?.message}
          />

          {/* button aksi */}
          <div className="w-full flex flex-row justify-end items-center gap-4 my-4">
            {/* button cancel */}
            <ButtonBackNonIcon label="Batal" />

            {/* button submit */}
            <ButtonSubmit isLoading={false} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormulirProduk;
