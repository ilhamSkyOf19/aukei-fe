import InputChoose from "../../../../components/inputs/InputChoose";
import InputImg from "../../../../components/inputs/InputImg";
import InputNumber from "../../../../components/inputs/InputNumber";
import InputPrice from "../../../../components/inputs/InputPrice";
import InputTextNonIcon from "../../../../components/inputs/InputTextNonIcon";
import ButtonBackText from "../../../../components/ui/button/ButtonBackText";
import ButtonCloseText from "../../../../components/ui/button/ButtonCloseText";
import ButtonText from "../../../../components/ui/button/ButtonText";
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
    isiPerBoxController,
    stokMinimumController,
    validatedIdParams,

    handleBack,
  } = useFormulirProduk();

  return (
    <div className="w-full">
      <div className="w-full h-full flex flex-col justify-start items-start px-2.5">
        {/* content */}
        <div className="w-full rounded-2xl md:rounded-xl shadow-xs dark:border dark:border-base-content/10 flex mt-4 flex-col justify-start items-start bg-base-100 px-4 lg:px-6 py-4">
          {/* header formulir */}
          <div className="w-full flex flex-row lg:justify-start lg:items-start lg:gap-4 relative justify-center items-center">
            {/* button kembali */}
            <div className="absolute lg:relative left-0">
              <ButtonBackText />
            </div>

            {/* title */}
            <div className="w-full flex flex-col justify-start items-end">
              {/* title */}
              <h2 className="text-sm lg:text-base font-semibold text-base-content">
                Formulir {validatedIdParams ? "Ubah" : "Tambah"} Produk
              </h2>

              {/* keterangan */}
              <p className="text-xs font-medium text-base-content/50">
                Silahkan isi formulir dibawah ini
              </p>
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-4"
          >
            <div className="w-full flex flex-col justify-start items-start lg:flex-row md:gap-6">
              {/* input img */}
              <div className="w-full h-60 md:h-80 lg:w-200 lg:h-80 mb-12 lg:mb-6">
                {isLoadingProdukDetail ? (
                  <div className="skeleton w-full h-full" />
                ) : (
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
                )}
              </div>

              <div className="w-full flex flex-col justify-start items-start">
                {/* nama */}
                {isLoadingProdukDetail ? (
                  <div className="w-full h-10 skeleton my-3" />
                ) : (
                  <InputTextNonIcon
                    register={register("nama")}
                    name="nama"
                    placeholder="Nama Produk"
                    label="Nama Produk"
                    required
                    max={100}
                    errorMessage={errors?.nama?.message}
                  />
                )}

                <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-2 lg:gap-6">
                  {/* kode produk */}
                  {isLoadingProdukDetail ? (
                    <div className="w-full h-10 skeleton my-3" />
                  ) : (
                    <InputTextNonIcon
                      register={register("kode")}
                      name="kode"
                      placeholder="Kode Produk"
                      label="Kode Produk"
                      required
                      max={50}
                      errorMessage={errors?.kode?.message}
                    />
                  )}

                  {/* kategori */}

                  {isLoadingProdukDetail ? (
                    <div className="w-full h-10 skeleton my-3" />
                  ) : (
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
                  )}
                </div>

                <div className="w-full flex flex-row justify-center items-center gap-2 lg:gap-6">
                  {isLoadingProdukDetail ? (
                    <>
                      <div className="w-full h-10 skeleton my-3" />
                      <div className="w-full h-10 skeleton my-3" />
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                <div className="w-full flex flex-col justify-start items-start lg:flex-row lg:gap-6">
                  {/* isi per box */}
                  {isLoadingProdukDetail ? (
                    <div className="w-full h-10 skeleton my-3" />
                  ) : (
                    <InputNumber<CreateProdukType | UpdateProdukType>
                      controller={isiPerBoxController}
                      label="Isi Per Box"
                      placeholder="Masukkan isi per box"
                      required
                      max={9999999999}
                    />
                  )}

                  {/* stok minimum */}
                  {isLoadingProdukDetail ? (
                    <div className="w-full h-10 skeleton my-3" />
                  ) : (
                    <InputNumber<CreateProdukType | UpdateProdukType>
                      controller={stokMinimumController}
                      label="Stok Minimum"
                      placeholder="Masukkan stok minimum"
                      required
                      max={9999999999}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* button aksi */}
            <div className="w-full flex flex-row justify-end items-center gap-4 mb-4">
              {isLoadingProdukDetail ? (
                <>
                  <div className="w-1/2 h-10 skeleton" />
                  <div className="w-1/2 h-10 skeleton" />
                </>
              ) : (
                <>
                  {/* button cancel */}
                  <ButtonCloseText
                    label="Kembali"
                    disabled={isLoadingKategori || isPendingMutateProduk}
                    handleClose={() => handleBack()}
                  />

                  {/* button submit */}
                  <ButtonText isLoading={isPendingMutateProduk} />
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormulirProduk;
