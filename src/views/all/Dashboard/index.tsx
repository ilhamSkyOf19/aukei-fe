import {
  Bell,
  Boxes,
  CalendarClock,
  ChartLine,
  HandCoins,
  Package,
  ReceiptText,
  ShoppingCart,
  SquareArrowLeft,
  SquareArrowRight,
  Store,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import blobKasir from "../../../assets/blob.svg";
import blobOwner from "../../../assets/blob-owner.svg";
import { Link } from "react-router-dom";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import { cn } from "../../../utils/cn";
import type { FC } from "react";
import useDashboard from "./useDashboard";
import ModalChooseIsActiveShadowFeature from "../../../components/modals/ModalChooseIsActiveShadowFeature";
const Dashboard = () => {
  // get use
  const {
    handleCloseModalFeature,
    handleShowModalFeature,
    modalShadowFeatureRef,
    pengguna,
    handleRedirectWa,
  } = useDashboard();

  return (
    <div
      className={cn(
        "w-full pt-4 px-4 pb-2.5 flex flex-col justify-center items-center",
      )}
    >
      <div
        className={cn(
          "w-full bg-base-100 rounded-2xl md:rounded-xl border border-base-content/10 shadow-xl flex flex-col justify-between items-center pt-8 px-4 pb-4 mb:pb-0 relative overflow-hidden",
          pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
            ? "min-h-[85vh] lg:h-[85vh] pb-20"
            : "h-[90vh]",
        )}
      >
        {/* button shadow feature */}
        {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
          <button
            type="button"
            className="absolute bottom-1 left-1 z-10 w-9 h-9 cursor-default!"
            onClick={() => handleShowModalFeature()}
          />
        )}

        {/* wave */}
        <div className="w-full bottom-0 h-full hidden lg:absolute lg:block">
          <img
            src={
              pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                ? blobOwner
                : blobKasir
            }
            alt="wave"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full flex flex-col justify-start items-center md:justify-center lg:justify-start">
          {/* icon */}
          <Store className="size-20 text-base stroke-1 z-1 shrink-0" />

          {/* title */}
          <div className="w-full flex flex-col justify-start items-center mt-2.5 z-1">
            <h1 className="text-base font-medium">Selamat datang di</h1>

            <h2 className="text-7xl font-black text-custom-primary-brand [-webkit-text-stroke:1px_#263d3f]">
              AUKEI
            </h2>

            <span className="mt-2.5 text-xl font-medium capitalize">
              Halo, {pengguna?.nama}!
            </span>

            <span className=" mt-2.5 text-xs text-center">
              Kelola bisnis Anda dengan lebih mudah, cepat, dan efisien. <br />{" "}
              Pantau transaksi, kelola produk, dan kembangkan usaha Anda bersama
              AUKEI.
            </span>

            <div className="w-30 h-0.5 bg-custom-primary rounded-full mt-4" />
          </div>

          {/* label */}
          <span className="text-xs font-medium text-base-content mt-1.5">
            Fitur yang tersedia
          </span>

          {/* button redirect statistik */}
          <div className="flex flex-row justify-center items-center mt-4 z-2 w-full">
            <div className="flex flex-row justify-center items-center gap-4 w-full lg:w-2/3 flex-wrap">
              {pengguna?.role === ROLE_INTERNAL_TYPE.KASIR && (
                <>
                  {/* kasir */}
                  <ButtonFeature
                    icon={Store}
                    label="Kasir"
                    link="/dashboard/kasir"
                  />

                  {/* keranjang */}
                  <ButtonFeature
                    icon={ShoppingCart}
                    label="Keranjang"
                    link="/dashboard/keranjang"
                  />

                  {/* kredit */}
                  <ButtonFeature
                    icon={HandCoins}
                    label="Kredit"
                    link="/dashboard/kredit"
                  />

                  {/* BOOKING */}
                  <ButtonFeature
                    icon={CalendarClock}
                    label="Booking"
                    link="/dashboard/booking"
                  />

                  {/* riwayat transaksi */}
                  <ButtonFeature
                    icon={ReceiptText}
                    label="Riwayat Transaksi"
                    link="/dashboard/riwayat-transaksi"
                  />

                  {/* pengajuan barang masuk */}
                  <ButtonFeature
                    icon={SquareArrowRight}
                    label="Pengajuan Barang Masuk"
                    link="/dashboard/pengajuan-barang-masuk"
                  />

                  {/* pengajuan barang keluar */}
                  <ButtonFeature
                    icon={SquareArrowLeft}
                    label="Pengajuan Barang Keluar"
                    link="/dashboard/pengajuan-barang-keluar"
                  />

                  {/* notifikasi */}
                  <ButtonFeature
                    icon={Bell}
                    label="Notifikasi"
                    link="/dashboard/notifikasi"
                  />
                </>
              )}

              {/* owner */}
              {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER && (
                <>
                  {/* produk */}
                  <ButtonFeature
                    icon={Boxes}
                    label="Produk"
                    link="/dashboard/produk"
                  />

                  {/* inventori */}
                  <ButtonFeature
                    icon={Package}
                    label="Inventori"
                    link="/dashboard/inventori"
                  />

                  {/* pegawai */}
                  <ButtonFeature
                    icon={UsersRound}
                    label="Pegawai"
                    link="/dashboard/pegawai"
                  />

                  {/* statistik */}
                  <ButtonFeature
                    icon={ChartLine}
                    label="Statistik"
                    link="/dashboard/statistik"
                  />

                  {/* pelanggan */}
                  <ButtonFeature
                    icon={UsersRound}
                    label="Pelanggan"
                    link="/dashboard/pelanggan"
                  />

                  {/* hand coins */}
                  <ButtonFeature
                    icon={HandCoins}
                    label="Kredit"
                    link="/dashboard/kredit"
                  />

                  {/* booking */}
                  <ButtonFeature
                    icon={CalendarClock}
                    label="Booking"
                    link="/dashboard/booking"
                  />

                  {/* riwayat transaksi */}
                  <ButtonFeature
                    icon={ReceiptText}
                    label="Riwayat Transaksi"
                    link="/dashboard/riwayat-transaksi"
                  />

                  {/* notifikasi */}
                  <ButtonFeature
                    icon={Bell}
                    label="Notifikasi"
                    link="/dashboard/notifikasi"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="w-full absolute bottom-4 lg:mr-8 flex flex-row justify-center lg:justify-end items-end">
          <div className="flex flex-col justify-start items-center lg:items-start">
            <span className="text-[0.625rem] text-base-content">
              Jika ada pertanyaan, silahkan hubungi :
            </span>
            <div className="flex flex-row justify-start items-start gap-1.5">
              <span className="text-base-content text-[0.625rem]">
                WhatsApp:
              </span>

              <button
                onClick={() => handleRedirectWa()}
                className="text-xs font-medium text-base-content hover:underline"
              >
                0858-9689-0881
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <ModalChooseIsActiveShadowFeature
        modalRef={modalShadowFeatureRef}
        handleCloseModal={handleCloseModalFeature}
      />
    </div>
  );
};

// button fitur
type ButtonFeatureProps = {
  label: string;
  link: string;
  icon: LucideIcon;
};

const ButtonFeature: FC<ButtonFeatureProps> = ({ icon: Icon, label, link }) => {
  return (
    <Link
      type={"button"}
      to={link}
      className="flex w-auto flex-row shrink-0 justify-center items-center rounded-xl px-3 gap-2 bg-base-100 shadow-md border border-transparent hover:border-custom-secondary transition-all duration-150 ease-in-out text-base-content h-10.5 md:h-9 cursor-pointer"
    >
      <Icon className="size-4.5 md:size-3.5 shrink-0" />

      <span className="font-medium text-xs md:text-[0.7rem]">{label}</span>
    </Link>
  );
};

export default Dashboard;
