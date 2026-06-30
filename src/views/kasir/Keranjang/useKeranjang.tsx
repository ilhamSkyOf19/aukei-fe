import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TransactionServices } from "../../../services/transaction.service";
import type { DetailsLocalStorageType } from "../../../models/transaction.model";

const useKeranjang = () => {
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
      TransactionServices.findForKeranjangByPelangganId({
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

  const handleLanjutTransaksi = (isUpdate?: boolean) => {
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

    // check is update
    if (isUpdate) {
      localStorage.setItem("isUpdateTransaction", "true");
    }

    // navigate
    navigate("/dashboard/kasir");

    return true;
  };

  return {
    isExistDataProduk,
    dataKeranjang,
    isLoadingKeranjang,
    totalDiskon,
    subTotalBeforeDiskon,
    totalAfterDiskon,
    handleLanjutTransaksi,
  };
};

export default useKeranjang;
