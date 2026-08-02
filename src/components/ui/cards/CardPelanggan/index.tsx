import type { FC } from "react";
import Avatar from "../../Avatar";
import {
  ChartColumn,
  Check,
  Clock,
  Eye,
  Hourglass,
  PackageSearch,
  Pencil,
  Phone,
  ShoppingBag,
  Trash2,
  Trophy,
} from "lucide-react";
import { formatNumberPhone } from "../../../../helpers/helpers";
import LabelCardPelanggan from "../../LabelCardPelanggan";
import type { IPelangganType } from "../../../../models/pelanggan.model";
import StatusPelanggan from "../../../StatusPelanggan";

type Props = {
  data: Partial<IPelangganType> & {
    totalTransaction?: number;
    booking?: number;
    kredit?: {
      berjalan: number;
      selesai: number;
      terlambat: number;
    };
    totalNilaiTransaction?: number;
    rankTransaction?: number;
    rankNilaiTransaction?: number;
    onlyStatus?: boolean;
  };

  // callback
  handleRedirectRiwayatTransaksiDetail?: (id: number) => void;
  handelUpdateIsActive?: (data: {
    id: number;
    status: boolean;
  }) => Promise<void>;
  handleShowModalDelete?: (
    id?: number,
    data?: {
      nama?: string;
    },
  ) => void;
  handleShowModalFormulirPelanggan?: (id?: number) => void;

  // state
  isPendingDelete?: boolean;
  variablesUpdateIsActive?: {
    id: number;
    status: boolean;
  };
};
const CardPelanggan: FC<Props> = ({
  data: {
    id,
    nama,
    noWa,
    booking,
    kredit,
    totalTransaction,
    isActive,
    rankNilaiTransaction,
    totalNilaiTransaction,
    rankTransaction,
    onlyStatus,
  },

  handleRedirectRiwayatTransaksiDetail,
  handelUpdateIsActive,
  handleShowModalDelete,
  handleShowModalFormulirPelanggan,
  isPendingDelete,
  variablesUpdateIsActive,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start bg-base-100 rounded-2xl shadow-sm border border-transparent dark:border-base-content/10 p-4">
      {/* content 1 */}
      <div className="w-full flex flex-row justify-between items-center pb-4 borde border-b border-base-content/10">
        <div className="flex flex-1 justify-start items-start gap-4">
          <Avatar nama={nama ?? ""} index={id} />
          <div className="flex w-full flex-col justify-start items-start gap-1">
            {/* name */}
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-base-content font-semibold text-sm">
                {nama}
              </span>

              {onlyStatus && <StatusPelanggan isActive={onlyStatus} />}
            </div>
            {/* no telp */}
            <div className="w-full flex flex-row justify-start items-center gap-2">
              <Phone className="size-3 text-base-content/80" />
              <span className="text-base-content/80 text-xs">
                {formatNumberPhone(noWa ?? "")}
              </span>
            </div>
          </div>
        </div>

        {/* aksi */}
        {handleRedirectRiwayatTransaksiDetail &&
          handelUpdateIsActive &&
          handleShowModalDelete &&
          handleShowModalFormulirPelanggan && (
            <div className="hidden md:flex flex-1 flex-row justify-end items-center gap-12">
              <Aksi
                handleRedirectRiwayatTransaksiDetail={
                  handleRedirectRiwayatTransaksiDetail
                }
                handelUpdateIsActive={handelUpdateIsActive}
                handleShowModalDelete={handleShowModalDelete}
                handleShowModalFormulirPelanggan={
                  handleShowModalFormulirPelanggan
                }
                pelanggan={{
                  id: id ?? 0,
                  isActive: isActive ?? false,
                  nama: nama ?? "",
                  noWa: noWa ?? "",
                }}
                isLoadingAktif={
                  isPendingDelete && variablesUpdateIsActive?.id === id
                }
                isPendingDelete={isPendingDelete}
                totalTransaction={totalTransaction}
              />
            </div>
          )}
      </div>

      {/* content 2 */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start gap-2 py-2 border-b border-base-content/10 md:border-none">
        {/* total transaksi */}
        {totalTransaction && (
          <LabelCardPelanggan
            label="Total Transaksi"
            icon={{
              icon: ShoppingBag,
              bgColor: "bg-purple-100",
              iconColor: "text-purple-400",
            }}
            value={totalTransaction}
          />
        )}

        {kredit && (
          <>
            {/* kredit selesai */}
            <LabelCardPelanggan
              label="Kredit Selesai"
              icon={{
                icon: Check,
                bgColor: "bg-emerald-100",
                iconColor: "text-emerald-400",
              }}
              value={kredit?.selesai}
            />

            {/* kredit berjalan */}
            <LabelCardPelanggan
              label="Kredit Berjalan"
              icon={{
                icon: Clock,
                bgColor: "bg-amber-100",
                iconColor: "text-amber-400",
              }}
              value={kredit?.berjalan}
            />

            {/* kredit terlambat */}
            <LabelCardPelanggan
              label="Kredit Terlambat"
              icon={{
                icon: Hourglass,
                bgColor: "bg-rose-100",
                iconColor: "text-rose-400",
              }}
              value={kredit?.terlambat}
            />
          </>
        )}

        {/* booking*/}
        {booking && (
          <LabelCardPelanggan
            label="Booking"
            icon={{
              icon: PackageSearch,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            value={booking}
          />
        )}

        {/* total nilai transaksi */}
        {totalNilaiTransaction && (
          <LabelCardPelanggan
            label="Total Nilai Transaksi"
            icon={{
              icon: ChartColumn,
              bgColor: "bg-emerald-100",
              iconColor: "text-emerald-400",
            }}
            valuePrice={totalNilaiTransaction}
          />
        )}

        {/* rank transaksi */}
        {rankTransaction && (
          <LabelCardPelanggan
            label="Rank Transaksi"
            icon={{
              icon: Trophy,
              bgColor: "bg-blue-100",
              iconColor: "text-blue-400",
            }}
            valueSting={`# ${rankTransaction} (${rankTransaction === 1 ? "Pertama" : rankTransaction === 2 ? "Kedua" : "Ketiga"})`}
          />
        )}

        {/* rank nilai transaksi */}
        {rankTransaction && (
          <LabelCardPelanggan
            label="Rank Nilai Transaksi"
            icon={{
              icon: Trophy,
              bgColor: "bg-amber-100",
              iconColor: "text-amber-400",
            }}
            valueSting={`#${rankNilaiTransaction} (${rankNilaiTransaction === 1 ? "Pertama" : rankNilaiTransaction === 2 ? "Kedua" : "Ketiga"})`}
          />
        )}
      </div>

      {/* content 3 */}
      {handleRedirectRiwayatTransaksiDetail &&
        handelUpdateIsActive &&
        handleShowModalDelete &&
        handleShowModalFormulirPelanggan && (
          <div className="w-full pt-2 md:hidden flex flex-row justify-between items-center">
            {/* aksi active */}
            <div className="flex-1 flex flex-row justify-start items-center gap-4">
              <Aksi
                handleRedirectRiwayatTransaksiDetail={
                  handleRedirectRiwayatTransaksiDetail
                }
                handelUpdateIsActive={handelUpdateIsActive}
                handleShowModalDelete={handleShowModalDelete}
                handleShowModalFormulirPelanggan={
                  handleShowModalFormulirPelanggan
                }
                pelanggan={{
                  id: id ?? 0,
                  isActive: isActive ?? false,
                  nama: nama ?? "",
                  noWa: noWa ?? "",
                }}
                isLoadingAktif={
                  isPendingDelete && variablesUpdateIsActive?.id === id
                }
                isPendingDelete={isPendingDelete}
                totalTransaction={totalTransaction}
              />
            </div>
          </div>
        )}
    </div>
  );
};

type PropsAksi = {
  isLoadingAktif?: boolean;
  pelanggan: {
    id: number;
    nama: string;
    noWa: string;
    isActive: boolean;
  };
  isPendingDelete?: boolean;
  totalTransaction?: number;
  handelUpdateIsActive: (params: { id: number; status: boolean }) => void;
  handleShowModalFormulirPelanggan: (id: number) => void;
  handleShowModalDelete: (
    id?: number,
    data?: {
      nama: string;
    },
  ) => void;
  handleRedirectRiwayatTransaksiDetail: (id: number) => void;
};
// aksi
const Aksi: FC<PropsAksi> = ({
  isLoadingAktif,
  totalTransaction,
  isPendingDelete,
  pelanggan,
  handelUpdateIsActive,
  handleShowModalFormulirPelanggan,
  handleShowModalDelete,
  handleRedirectRiwayatTransaksiDetail,
}) => {
  return (
    <>
      {/* label */}
      <div className=" flex flex-row justify-start items-center gap-4">
        <span className="text-xs font-medium text-base-content">Aktif</span>

        {/* input */}
        {isLoadingAktif ? (
          <div className="w-10 h-6 rounded-full flex justify-center items-center border border-base-content/10">
            <div className="loading loading-xs" />
          </div>
        ) : (
          <input
            type="checkbox"
            checked={pelanggan.isActive}
            className="toggle toggle-success toggle-sm"
            onChange={() =>
              handelUpdateIsActive({
                id: pelanggan.id,
                status: !pelanggan.isActive,
              })
            }
          />
        )}
      </div>

      {/* aksi */}
      <div className="flex flex-1 flex-row justify-end items-center gap-2">
        {/* button redirect */}
        <button
          type="button"
          className="w-8 h-8 flex justify-center items-center rounded-lg hover-overlay bg-custom-primary/50"
          onClick={() => handleRedirectRiwayatTransaksiDetail(pelanggan.id)}
        >
          <Eye className="text-custom-secondary size-4" />
        </button>
        {/* button update */}
        <button
          type="button"
          className="w-8 h-8 flex justify-center items-center rounded-lg hover-overlay bg-blue-100"
          onClick={() => handleShowModalFormulirPelanggan(pelanggan.id)}
        >
          <Pencil className="text-blue-400 size-4" />
        </button>
        {/* button delete */}
        <button
          type="button"
          disabled={(totalTransaction ?? 0) > 0 || isPendingDelete}
          className="w-8 h-8 disabled:opacity-50 not-disabled:hover-overlay flex justify-center items-center rounded-lg bg-rose-100"
          style={{
            cursor: (totalTransaction ?? 0) > 0 ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if ((totalTransaction ?? 0) > 0) return;

            handleShowModalDelete(pelanggan.id, {
              nama: pelanggan.nama,
            });
          }}
        >
          {isPendingDelete ? (
            <div className="loading loading-xs" />
          ) : (
            <Trash2 className="text-rose-400 size-4" />
          )}
        </button>
      </div>
    </>
  );
};

export default CardPelanggan;
