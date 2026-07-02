import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { DetailsLocalStorageType } from "../../../../models/transaction.model";
import { KeranjangServices } from "../../../../services/keranjang.service";
import useModal from "../../../../hooks/useModal";

const useDaftarKeranjang = () => {
  // set params
  const [searchParams] = useSearchParams();

  //   is choose pelanggan
  const isChoosePelanggan = Number(searchParams.get("pelangganId") ?? 0);

  // current pathname
  const currentPathname = useLocation().pathname;

  // navigate
  const navigate = useNavigate();

  // query client
  const queryClient = useQueryClient();

  // use modal delete keranjang
  const {
    modalRef: modalDeleteKeranjangRef,
    handleShowModal: handleShowModalDeleteKeranjang,
    handleCloseModal: handleCloseModalDeleteKeranjang,
    dataModal: dataDeleteKeranjang,
  } = useModal<{ id?: number; pelanggan: { id?: number; nama?: string } }>();

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

  const handleLanjutTransaksi = (transactionId?: number) => {
    // data
    handleSetLocalStorage();

    // set local storage
    localStorage.setItem(
      "data-from-keranjang",
      JSON.stringify({ transactionId }),
    );

    // navigate
    navigate("/dashboard/kasir");
  };

  // handle ubah keranjang
  const handleUbahKeranjang = () => {
    // set local storage is update keranjang
    localStorage.setItem(
      "is-update-keranjang",
      JSON.stringify({
        pelangganId: dataKeranjang?.data?.pelanggan?.id,
      }),
    );

    // handle local storage
    handleSetLocalStorage();

    // navigate
    navigate(`${currentPathname}/${dataKeranjang?.data?.id}`);
  };

  // mutation delete keranjang
  const {
    mutateAsync: mutateDeleteKeranjang,
    isPending: isPendingDeleteKeranjang,
  } = useMutation({
    mutationFn: (data: { id: number; pelangganId: number }) =>
      KeranjangServices.delete({ id: data.id, pelangganId: data.pelangganId }),
    onSuccess: () => {
      // invalidate
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });

      // set toast
      navigate(currentPathname, {
        state: {
          toast: "deleted_keranjang",
        },
      });

      // close modal
      handleCloseModalDeleteKeranjang();
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // handle delete
  const handleDeleteKeranjang = async () => {
    try {
      if (!dataDeleteKeranjang) return;

      const {
        id,
        pelanggan: { id: pelangganId },
      } = dataDeleteKeranjang;

      // check id and pelanggan id
      if (id && pelangganId) await mutateDeleteKeranjang({ id, pelangganId });
    } catch (error) {
      console.log(error);
    }
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
    handleDeleteKeranjang,
    isPendingDeleteKeranjang,
    modalDeleteKeranjangRef,
    handleCloseModalDeleteKeranjang,
    handleShowModalDeleteKeranjang,
    dataDeleteKeranjang,
  };
};

export default useDaftarKeranjang;
