import { MonitorSmartphone } from "lucide-react";

const NotCompatible = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col justify-center items-center lg:hidden">
      {/* icon */}
      <div className="flex flex-row justify-center items-center">
        <MonitorSmartphone className="size-35 stroke-1" />
      </div>

      <div className="flex flex-col justify-start items-center w-3/4 gap-2">
        {/* title */}
        <span className="text-base-content text-lg font-semibold text-center">
          Halaman ini tidak dapat dibuka di perangkat ini
        </span>
        {/* deskripsi */}
        <span className="text-base-content/50 text-xs font-medium text-center">
          Untuk pengalaman terbaik, silahkan akses melalui perangkat laptop atau
          dekstop
        </span>
      </div>
    </div>
  );
};

export default NotCompatible;
