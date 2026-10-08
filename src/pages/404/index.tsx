import { Link } from "react-router-dom";
import notFoundImg from "../../assets/404.svg";
const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-base-100">
      {/* img */}
      <div className="w-60">
        <img
          src={notFoundImg}
          alt="not found"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* message */}
      <div className="flex flex-col justify-center items-center mt-6">
        <h1 className="text-base-content font-medium text-2xl">
          Halaman Tidak Ditemukan
        </h1>
        <span className="text-xs text-base-content">
          Maaf, halaman yang Anda cari tidak tersedia
        </span>
      </div>

      {/* button back */}
      <Link
        to={"/dashboard"}
        className="rounded-2xl md:rounded-xl bg-custom-secondary text-custom-primary py-2 px-4 text-xs font-medium mt-4 hover-overlay"
      >
        Kembali
      </Link>
    </div>
  );
};

export default NotFoundPage;
