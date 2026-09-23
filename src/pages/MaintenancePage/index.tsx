import gear from "../../assets/gear.svg";
const MaintenancePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="w-full flex justify-center items-center">
          <img src={gear} alt="" width={100} />
        </div>

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Website Sedang Maintenance
        </h1>

        <p className="mb-6 text-sm leading-6 text-gray-500">
          Kami sedang melakukan pemeliharaan sistem. Silakan kembali beberapa
          saat lagi.
        </p>

        <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600">
          Maintenance Mode
        </span>
      </div>
    </div>
  );
};

export default MaintenancePage;
