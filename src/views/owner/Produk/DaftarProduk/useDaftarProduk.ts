import { useFilterSearch } from "../../../../hooks/useFilterSearch";
import { useFilter } from "../../../../hooks/useFilter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProdukServices } from "../../../../services/produk.service";
import { useLocation, useNavigate } from "react-router-dom";
import useModal from "../../../../hooks/useModal";
import useDeleteProduk from "../../../../hooks/useDeleteProduk";
import useUpdateProdukIsActive from "../../../../validations/useUpdateProdukIsActive";
import type { IProduk } from "../../../../models/produk.model";

const useDaftarProduk = (params: {
  handleSetToast: (toast: string) => void;
}) => {
  const { handleSetToast } = params;

  const currentPathname = useLocation().pathname;

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

  // Modal generate harga jual
  const {
    modalRef: modalGenerateHargaJualRef,
    handleShowModal: handleShowModalGenerateHargaJual,
    handleCloseModal: handleCloseModalGenerateHargaJual,
    dataModal: dataModalGenerateHargaJual,
  } = useModal<{
    produk: Pick<
      IProduk,
      "id" | "nama" | "img" | "hargaJual" | "kategori" | "kode"
    >;
  }>();

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
  const {
    data: dataProduk,
    isLoading: isLoadingProduk,
    isRefetching: isRefetchingProduk,
  } = useQuery({
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

  const {
    handelUpdateIsActive,
    isPendingUpdateIsActive,
    variablesUpdateIsActive,
  } = useUpdateProdukIsActive({ handleSetToast });

  // Ekspos state & handler yang dibutuhkan oleh komponen UI daftar produk
  return {
    handleRedirectDetail,
    handleRedirectTambah,
    handleSearch,
    handleSort,
    handleKategori,
    handleLimit,
    handlePage,
    dataProduk,
    isLoadingProduk: isLoadingProduk || isRefetchingProduk,
    isExistDataProduk,
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
    modalGenerateHargaJualRef,
    handleCloseModalGenerateHargaJual,
    handleShowModalGenerateHargaJual,
    dataModalGenerateHargaJual,
  };
};

export default useDaftarProduk;
