import DataPelanggan from "./DataPelanggan";

const Keranjang = () => {
  // use call

  return (
    <div className="w-full flex flex-row justify-between items-start p-4">
      {/* left */}
      <div className="flex-2 flex flex-col justify-start items-start gap-4">
        {/* daftar pelanggan */}
        <DataPelanggan />
      </div>

      <div className="flex-5"></div>
    </div>
  );
};

export default Keranjang;
