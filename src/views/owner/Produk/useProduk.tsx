import { useEffect, useState } from "react";
import { useFilterSearch } from "../../../hooks/useFilterSearch";
import { useFilter } from "../../../hooks/useFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../../../services/produk.service";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToastAnimation } from "../../../hooks/useToast";
import useModal from "../../../hooks/useModal";
import useDeleteProduk from "../../../hooks/useDeleteProduk";

// Key localStorage untuk menyimpan cluster inventori yang sedang aktif
const LOCAL_STORAGE_KEYS = {
  ACTIVE_CLUSTER: "active-cluster",
} as const;

// Cluster inventori yang tersedia pada halaman produk
type InventoriCluster = "produk" | "kategori" | "spesifikasi" | "";

const useProduk = () => {
  const currentPathname = useLocation().pathname;

  const [_searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();

  // Modal konfirmasi hapus produk
  const {
    modalRef: modalDeleteRef,
    handleShowModal: handleShowModalDelete,
    handleCloseModal: handleCloseModalDelete,
    idModal: idModalDelete,
    dataModal: dataDeleteProduk,
  } = useModal<{ nama: string }>();

  // Modal alert saat penghapusan produk gagal
  const {
    modalRef: modalFailedDeleteRef,
    handleShowModal: showModalFailedDelete,
    handleCloseModal: handleCloseModalFailedDelete,
    dataModal: dataModalFailedDelete,
  } = useModal<{ titleMessage: string; description: string }>();

  // Tampilkan modal gagal hapus dengan pesan berisi nama produk yang gagal dihapus
  const handleShowModalFailedDelete = () => {
    showModalFailedDelete(undefined, {
      titleMessage: `Produk "${dataDeleteProduk?.nama}" tidak dapat dihapus`,
      description:
        "Produk masih digunakan oleh data lain. Nonaktifkan produk jika tidak lagi digunakan.",
    });
  };

  // Hapus satu produk (mutation, redirect, invalidate query dikelola oleh useDeleteProduk)
  const { handleDeleteProduk, isPendingDeleteProduk } = useDeleteProduk({
    handleShowModalFailedDelete,
    validatedIdParams: idModalDelete || null,
    handleCloseModal: handleCloseModalDelete,
    redirectPathname: currentPathname,
    handleInvalidate: () =>
      queryClient.invalidateQueries({ queryKey: ["produk"] }),
  });

  const navigate = useNavigate();

  const { toast, handleSetToast } = useToastAnimation();

  // Cluster inventori yang sedang aktif (produk/kategori/spesifikasi)
  const [isActiveCluster, setIsActiveCluster] = useState<InventoriCluster>("");

  // Ubah cluster aktif, reset search params, dan simpan pilihan ke localStorage
  const handleActiveCluster = (cluster: InventoriCluster) => {
    setIsActiveCluster(cluster);

    // Cluster berganti, params filter lama sudah tidak relevan
    setSearchParams({});

    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_CLUSTER, cluster);
  };

  // Muat cluster aktif terakhir dari localStorage saat pertama kali render, default ke "produk"
  useEffect(() => {
    const datalocalStorage = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACTIVE_CLUSTER,
    );

    if (datalocalStorage) {
      setIsActiveCluster(datalocalStorage as InventoriCluster);
    } else {
      setIsActiveCluster("produk");
    }
  }, []);

  // Filter pencarian produk (query param "search")
  const { search, setSearch: handleSearch } = useFilterSearch("search");

  // Filter urutan data (query param "sort"), default descending
  const { filter: sort, setFilter: handleSort } = useFilter({
    paramName: "sort",
    allowQuery: ["asc", "desc"],
    defaultValueCustom: "desc",
  });

  // Filter kategori produk (query param "kategori")
  const { filter: kategori, setFilter: handleKategori } = useFilter({
    paramName: "kategori",
  });

  // Filter halaman (pagination, query param "page")
  const { filter: page, setFilter: handlePage } = useFilter({
    paramName: "page",
    isNumber: true,
  });

  // Filter jumlah data per halaman (query param "limit")
  const { filter: limit, setFilter: handleLimit } = useFilter({
    paramName: "limit",
    isNumber: true,
  });

  // Ambil data produk dari server sesuai filter search/sort/kategori/page/limit
  const { data: dataProduk, isLoading: isLoadingProduk } = useQuery({
    queryKey: ["produk", { search, sort, kategori, limit, page }],
    queryFn: () =>
      ProdukServices.findAll({
        ...(search && { search }),
        ...(sort && { sort }),
        ...(kategori && { kategori }),
        ...(limit && { limit }),
        ...(page && { page }),
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Apakah data produk sudah selesai dimuat dan tidak kosong
  const isExistDataProduk: boolean =
    !isLoadingProduk && !!dataProduk?.data?.data?.length;

  // Arahkan ke halaman detail produk
  const handleRedirectDetail = (id: number) => {
    navigate(`${currentPathname}/${id}`);
  };

  // Arahkan ke halaman tambah produk
  const handleRedirectTambah = () => {
    navigate(`${currentPathname}/tambah`);
  };

  // Mutation untuk mengubah status aktif/nonaktif produk
  const {
    mutateAsync: mutateUpdateIsActive,
    isPending: isPendingUpdateIsActive,
    variables: variablesUpdateIsActive,
  } = useMutation({
    mutationFn: (data: { id: number; status: boolean }) =>
      ProdukServices.updateStatus({
        id: data.id,
        status: data.status,
      }),
    onSuccess: () => {
      handleSetToast("updated_status");
      queryClient.invalidateQueries({ queryKey: ["produk"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Ubah status aktif/nonaktif satu produk
  const handelUpdateIsActive = async (data: {
    id: number;
    status: boolean;
  }) => {
    try {
      await mutateUpdateIsActive(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Ekspos state & handler yang dibutuhkan oleh komponen UI daftar produk
  return {
    handleRedirectDetail,
    handleRedirectTambah,
    isActiveCluster,
    handleActiveCluster,
    handleSearch,
    handleSort,
    handleKategori,
    handleLimit,
    handlePage,
    dataProduk,
    isLoadingProduk,
    isExistDataProduk,
    toast,
    handleShowModalDelete,
    modalDeleteRef,
    isPendingDeleteProduk,
    handleDeleteProduk,
    dataDeleteProduk,
    handleCloseModalDelete,
    kategori,
    sort,
    handelUpdateIsActive,
    variablesUpdateIsActive,
    isPendingUpdateIsActive,
    modalFailedDeleteRef,
    handleCloseModalFailedDelete,
    dataModalFailedDelete,
  };
};

export default useProduk;
