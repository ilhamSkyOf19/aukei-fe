import { type FC } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";

const Login: FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 lg:flex-row">
      {/* header */}
      <div className="w-full py-4 flex flex-row justify-center items-center gap-4 lg:flex-col">
        {/* icon */}
        {/* <img
          src={logoFikom}
          alt="logo fikom"
          loading="lazy"
          className="w-24 lg:w-70"
        /> */}

        {/* title */}
        <div className="flex flex-col justify-start items-center gap-1">
          {/* big title */}
          <h1 className="text-lg font-semibold w-full lg:text-2xl">
            Aplikasi Manajemen Borang Akreditasi
          </h1>

          {/* small title */}
          <h2 className="text-xs font-medium w-full lg:text-base lg:text-center">
            Fakultas Ilmu Komputer <br /> Universitas Muhammadiyah Metro
          </h2>
        </div>
      </div>

      {/* from */}
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-start items-center lg:w-md lg:card lg:shadow-sm lg:py-14 lg:px-8">
          {/* header */}
          <div className="w-full flex flex-col justify-start items-start">
            <h2 className="text-lg font-semibold lg:text-2xl">
              Selamat Datang,
            </h2>

            <h2 className="text-xs lg:text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </h2>
          </div>

          {/* input field */}
          <form
            // onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-start items-start mt-5 gap-4 lg:mt-6"
          >
            <div
              className={cn(
                "w-full flex flex-col justify-start items-start",
                // errors.identifier || errors.password
                //   ? "gap-6"
                //   : "gap-1 lg:gap-2",
              )}
            >
              {/* input field */}
            </div>

            {/* button submit */}
            <div className="w-full mt-8 lg:mt-4 flex flex-col justify-center items-center gap-4">
              {/* forget password */}
              <Link
                to={"/forget-password"}
                type="button"
                className="text-xs text-base-content hover:text-primary-purple transition-colors duration-300 ease-in-out"
              >
                Lupa Password?
              </Link>
              <button
                className={cn(
                  "w-full btn btn-sm lg:btn-md bg-primary-purple relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-primary-black/20 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:ease-in-out",
                )}
                type="submit"
              >
                {/* is pending */}
                {false ? (
                  <span className="loading loading-spinner loading-xs text-primary-white"></span>
                ) : (
                  <span className="text-white font-medium">Log in</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
