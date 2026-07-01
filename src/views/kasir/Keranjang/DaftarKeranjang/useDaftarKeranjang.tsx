import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { DetailsLocalStorageType } from "../../../../models/transaction.model";
import { KeranjangServices } from "../../../../services/keranjang.service";

const useDaftarKeranjang = () => {
  // set params
  const [searchParams] = useSearchParams();

  //   is choose pelanggan
  const isChoosePelanggan = Number(searchParams.get("pelangganId") ?? 0);

  // navigate
  const navigate = useNavigate();

  // use query
  const { data: dataKeranjang, isLoading: isLoadingKeranjang } = useQuery({
    queryKey: ["keranjang", isChoosePelanggan],
    queryFn: () =>
      KeranjangServices.findByPelangganId({
        id: isChoosePelanggan,
      }),
    enabled: !!isChoosePelanggan,
    retry: false,
    refetchOnWindowFocus: false,
  });

  //   is existing produk
  const isExistDataProduk: boolean =
    !isLoadingKeranjang && dataKeranjang?.data ? true : false;

  // total diskon
  const totalDiskon =
    dataKeranjang?.data?.details?.reduce((a, b) => a + b.diskon, 0) ?? 0;

  // sub total
  const subTotalBeforeDiskon =
    dataKeranjang?.data?.details?.reduce(
      (a, b) => a + b.hargaJual * b.quantity,
      0,
    ) ?? 0;

  // total
  const totalAfterDiskon =
    dataKeranjang?.data?.details?.reduce(
      (a, b) => a + (b.hargaJual * b.quantity - b.diskon),
      0,
    ) ?? 0;

  // handle set local storage
  const handleSetLocalStorage = () => {
    // data
    const data: DetailsLocalStorageType[] | null =
      dataKeranjang?.data?.details?.map((item, _) => ({
        nama: item.produk.nama,
        kode: item.produk.kode,
        img: item.produk.img,
        diskon: item.diskon,
        hargaJual: item.hargaJual,
        produkId: item.produk.id,
        quantity: item.quantity,
      })) ?? null;

    // set details
    localStorage.setItem("details", JSON.stringify(data));

    // set pelanggan
    localStorage.setItem(
      "pelanggan",
      JSON.stringify(dataKeranjang?.data?.pelanggan),
    );
  };

  const handleLanjutTransaksi = (isUpdate?: boolean) => {
    // data
    handleSetLocalStorage();

    // check is update
    if (isUpdate) {
      localStorage.setItem("isUpdateTransaction", "true");
    }

    // navigate
    navigate("/dashboard/kasir");
  };

  // handle ubah keranjang
  const handleUbahKeranjang = () => {
    // set local storage is update keranjang
    localStorage.setItem(
      "isUpdateKeranjang",
      JSON.stringify({
        pelangganId: dataKeranjang?.data?.pelanggan?.id,
      }),
    );

    // handle local storage
    handleSetLocalStorage();

    // navigate
    navigate(`/dashboard/keranjang/${dataKeranjang?.data?.id}`);
  };

  return {
    isExistDataProduk,
    dataKeranjang,
    isLoadingKeranjang,
    totalDiskon,
    subTotalBeforeDiskon,
    totalAfterDiskon,
    handleLanjutTransaksi,
    handleUbahKeranjang,
  };
};

export default useDaftarKeranjang;
