import { ChartColumn, ChevronRight, Mail, Phone, Store } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
import blob from "../../../assets/blob.svg";
import { formatNumberPhone } from "../../../helpers/helpers";
import { Link } from "react-router-dom";
import { ROLE_INTERNAL_TYPE } from "../../../types/constant.type";
import { cn } from "../../../utils/cn";
const Dashboard = () => {
  // get pengguna
  const pengguna = useAuthStore((state) => state.pengguna);
  return (
    <div
      className={cn(
        "w-full pt-4 px-4 pb-2.5 flex flex-col justify-center items-center",
        pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
          ? "md:h-[90vh]"
          : "lg:h-full",
      )}
    >
      <div className="w-full h-full bg-base-100 rounded-2xl md:rounded-xl border border-base-content/10 shadow-xl flex flex-col justify-between items-center pt-8 px-4 pb-4 mb:pb-0 relative overflow-hidden">
        {/* wave */}
        <div className="w-full bottom-0 h-full hidden lg:absolute lg:block">
          <img src={blob} alt="wave" className="w-full h-full object-cover" />
        </div>

        <div className="w-full flex flex-col justify-start items-center md:justify-center lg:justify-start">
          {/* icon */}
          <Store className="size-20 text-base-content stroke-1 z-1 shrink-0" />

          {/* title */}
          <div className="w-full flex flex-col justify-start items-center mt-2.5 z-1">
            <h1 className="text-base-content text-base font-medium">
              Selamat datang di
            </h1>

            <h2 className="text-7xl font-black text-custom-primary [-webkit-text-stroke:1px_#263d3f]">
              AUKEI
            </h2>

            <span className="text-base-content mt-2.5 text-xl font-medium capitalize">
              Halo, {pengguna?.nama}!
            </span>

            <span className="text-base-content mt-2.5 text-xs text-center">
              Kelola bisnis Anda dengan lebih mudah, cepat, dan efisien. <br />{" "}
              Pantau transaksi, kelola produk, dan kembangkan usaha Anda bersama
              AUKEI.
            </span>

            <div className="w-30 h-0.5 bg-custom-primary rounded-full mt-4" />
          </div>

          {/* button redirect statistik */}
          <Link
            to={
              pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                ? "/dashboard/statistik"
                : "/dashboard/kasir"
            }
            type="button"
            className="flex flex-row justify-start items-center gap-2.5 mt-8 px-4 h-10.5 md:h-9 hover-overlay bg-custom-primary rounded-2xl md:rounded-xl text-custom-secondary shadow-md shrink-0"
          >
            {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER ? (
              <ChartColumn className="size-5" />
            ) : (
              <Store className="size-5" />
            )}

            {/* label */}
            <span className="text-xs font-medium pr-6">
              {pengguna?.role === ROLE_INTERNAL_TYPE.OWNER
                ? "Lihat Statistik"
                : "Kasir"}
            </span>

            <ChevronRight className="size-5" />
          </Link>
        </div>

        {/* footer */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-center h-auto lg:h-22 border border-base-content/10 rounded-2xl md:rounded-xl mt-12 bg-base-100 shadow-md z-10 p-4">
          {/* label */}
          <div className="flex-1 flex flex-col justify-start items-start gap-1">
            <span className="text-sm font-semibold text-base-content">
              Dikembangkan oleh Iam<span className="text-error">Dev</span>{" "}
              Developer
            </span>

            <span className="text-[0.7rem] text-base-content">
              Butuh bantuan atau memiliki masukan? <br /> Hubungi kami melalui:
            </span>
          </div>

          {/* email */}
          <div className="flex-2 mt-6 lg:mt-0 flex flex-col md:flex-row justify-start items-start md:justify-between md:items-center gap-2.5 md:gap-8">
            <div className="flex-1 flex flex-row justify-start items-center gap-4 md:border-r border-b md:border-b-0 pb-2.5 md:pb-0 border-base-content/10 md:pr-4 lg:pr-0">
              {/* icon */}
              <div className="w-12 h-12 rounded-xl flex justify-center items-center border border-base-content/10">
                <Mail className="size-6 text-base-content" />
              </div>

              {/* label */}
              <div className="flex flex-col justify-start items-start gap-0.5">
                <span className="text-sm font-semibold text-base-content">
                  Email
                </span>
                <span className="text-xs text-base-content">
                  ilhamrohmatulloh2019bm@gmail.com
                </span>
              </div>
            </div>

            {/* wa */}
            <div className="flex-1 flex flex-row justify-start items-center gap-4">
              {/* icon */}
              <div className="w-12 h-12 rounded-xl flex justify-center items-center border border-base-content/10">
                <Phone className="size-6 text-base-content" />
              </div>

              {/* label */}
              <div className="flex flex-col justify-start items-start gap-0.5">
                <span className="text-sm font-semibold text-base-content">
                  Whatsapp
                </span>
                <span className="text-xs text-base-content">
                  {formatNumberPhone("085896890881")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
