import { EyeOff, PencilLine, Plus, RefreshCcw } from "lucide-react";
import ButtonWithIcon from "../../../components/ui/button/ButtonWithIcon";
import { cn } from "../../../utils/cn";
import useShadow from "./useShadow";
import { formatRupiah } from "../../../helpers/helpers";
import Toast from "../../../components/messages/Toast";
import { TOAST_CONFIG_PERIODE_SHADOW } from "../../../types/toast.type";
import ModalFormulirPeriodeShadow from "../../../components/modals/ModalFormulirPeriodeShadow";
import { formatTanggalPanjang } from "../../../helpers/formatDate";

const Shadow = () => {
  // get use shadow
  const {
    pilihan,
    selected,
    setSelected,
    dataPeriodeShadow,
    isLoadingPeriodeShadow,

    handleSetToast,
    toast,
    dataFormulirPeriodeShadow,
    handleCloseModalFormulirPeriodeShadow,
    handleShowModalFormulirPeriodeShadow,
    modalFormulirPeriodeShadowRef,

    handleCutAll,
    isPendingCutAll,
    variablesCutAll,

    handleCloseNavigation,
    isPendingCloseNavigation,
  } = useShadow();

  return (
    <div className="w-full">
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          label={TOAST_CONFIG_PERIODE_SHADOW[toast.type].message}
          color={TOAST_CONFIG_PERIODE_SHADOW[toast.type].color}
        />
      )}
      <div className="w-full flex lg:flex-row flex-col justify-start items-stretch gap-2.5 px-2 pt-2.5">
        {/* title */}
        <div className="flex-1 w-full flex flex-col justify-start items-start">
          {/* PERBAIKI CARD FILTER NYA  */}
          <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start lg:sticky top-14 ">
            {/* title */}
            <div className="flex flex-col justify-start items-start gap-0.5">
              <h3 className="text-sm font-semibold text-base-content">
                Nilai Bayangan
              </h3>

              <span className="text-[0.625rem] font-medium text-base-content/70">
                Silahkan pilih tipe pemangkasan
              </span>
            </div>

            {/* pilihan */}
            <div className="w-full flex flex-row overflow-y-auto lg:flex-col justify-start items-start gap-2.5">
              {/* btn */}
              {pilihan.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "lg:w-full h-12 rounded-2xl md:rounded-xl border flex flex-row justify-start items-center gap-2.5 px-2.5 transition-all duration-100 ease-in-out shrink-0",
                    selected === item.key
                      ? "border-custom-secondary bg-custom-primary shadow-md text-text-custom-secondary"
                      : "border-base-content/10 hover:border-custom-secondary text-base-content hover:bg-custom-primary/10",
                  )}
                  onClick={() => setSelected(item.key)}
                >
                  {/* icon */}
                  <item.icon className={cn("size-5")} />

                  <span className="text-xs font-medium text-left">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start lg:sticky top-14 mt-2.5">
            {/* close navigasi */}

            <button
              type="button"
              disabled={isPendingCloseNavigation}
              className={cn(
                "lg:w-full h-12 rounded-2xl md:rounded-xl border flex flex-row justify-start items-center gap-2.5 px-2.5 transition-all duration-100 ease-in-out shrink-0 border-base-content/10 text-base-content ",
                !isPendingCloseNavigation &&
                  "hover:border-custom-secondary hover:bg-custom-primary/10",
              )}
              onClick={() => handleCloseNavigation()}
            >
              {isPendingCloseNavigation ? (
                <div className="w-full flex justify-center items-center">
                  <div className="loading loading-xs" />
                </div>
              ) : (
                <>
                  {/* icon */}
                  <EyeOff className={cn("size-5")} />

                  <span className="text-xs font-medium text-left">
                    Tutup Halaman
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-4 flex flex-col justify-start items-start gap-2.5">
          <div className="bg-base-100 w-full shadow-sm border border-transparent dark:border-base-content/10 rounded-2xl md:rounded-xl p-2.5 gap-4 flex flex-col justify-start items-start pb-4">
            <div className="w-full flex flex-row justify-between items-start">
              <div className="w-full gap-0.5 flex flex-col justify-start items-start">
                <span className="text-sm font-medium text-base-content">
                  Pangkas Semua
                </span>

                <span className="text-[0.7rem] w-[70%] text-base-content/70">
                  Sesuaikan dan pangkas seluruh nilai modal, omzet, dan laba
                  berdasarkan tahun yang dipilih serta nilai nominal yang
                  dimasukkan.
                </span>
              </div>
            </div>

            {/* header */}
            <div className="w-full flex flex-row justify-between items-center">
              <ButtonWithIcon
                icon={Plus}
                label="Tambahkan Daftar"
                bgColor="bg-emerald-600"
                textColor="text-primary-white"
                handleBtn={() => handleShowModalFormulirPeriodeShadow()}
              />
            </div>

            {/* daftar */}
            <div className="w-full flex flex-col justify-start items-start gap-8 mt-4">
              {isLoadingPeriodeShadow ? (
                <>
                  <div className="h-10.5 md:h-9 w-full skeleton" />
                  <div className="h-10.5 md:h-9 w-full skeleton" />
                  <div className="h-10.5 md:h-9 w-full skeleton" />
                </>
              ) : dataPeriodeShadow &&
                dataPeriodeShadow.data &&
                dataPeriodeShadow?.data?.length > 0 ? (
                dataPeriodeShadow.data.map((item, index) => (
                  <div
                    key={item.id}
                    className="w-full flex flex-row justify-start items-stretch gap-10"
                  >
                    <span className="text-xs font-semibold text-base-content">
                      {index + 1}
                    </span>

                    <div className="flex flex-col justify-start items-start min-w-30 gap-1">
                      <span className="text-xs font-medium text-base-content">
                        Periode Tahun
                      </span>
                      <span className="text-xs font-semibold text-emerald-500">
                        {item.tahun}
                      </span>
                    </div>
                    <div className="flex flex-col justify-start items-start min-w-30 gap-1">
                      <span className="text-xs font-medium text-base-content">
                        Nilai Custom
                      </span>
                      <span className="text-xs font-semibold text-blue-500">
                        {formatRupiah(item.nilai)}
                      </span>
                    </div>

                    {/* aksi */}
                    <div className="flex flex-row justify-start items-start min-w-30 gap-4">
                      <ButtonWithIcon
                        icon={PencilLine}
                        label="Ubah Data"
                        bgColor="bg-info"
                        textColor="text-primary-white"
                        handleBtn={() =>
                          handleShowModalFormulirPeriodeShadow(undefined, {
                            data: item,
                            id: item.id,
                          })
                        }
                      />
                      <ButtonWithIcon
                        icon={RefreshCcw}
                        label="Generate Ulang"
                        disabled={item.nilai === 0}
                        isLoading={
                          isPendingCutAll &&
                          variablesCutAll?.periode === item.tahun
                        }
                        handleBtn={() =>
                          handleCutAll({
                            customOmzet: item.nilai,
                            periode: item.tahun,
                          })
                        }
                      />

                      <div className="h-full flex justify-center items-center">
                        {item.lastGenerate ? (
                          <span className="text-[0.7rem] text-base-content">
                            Terakhir digenerate{" "}
                            {formatTanggalPanjang(item.lastGenerate)}
                          </span>
                        ) : (
                          <span className="text-[0.7rem] text-base-content">
                            Belum pernah digenerate
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-row justify-center items-center">
                  <span className="text-xs text-base-content">
                    Data periode tidak tersedia, silahkan tambahkan data
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal formulir periode shadow */}
      <ModalFormulirPeriodeShadow
        modalRef={modalFormulirPeriodeShadowRef}
        handleCloseModal={handleCloseModalFormulirPeriodeShadow}
        handleSetToast={handleSetToast}
        data={dataFormulirPeriodeShadow?.data}
        id={dataFormulirPeriodeShadow?.id}
      />
    </div>
  );
};

export default Shadow;
