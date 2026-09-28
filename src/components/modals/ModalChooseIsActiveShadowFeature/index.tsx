import { type FC, type RefObject } from "react";
import { HatGlasses, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ButtonWithIcon from "../../ui/button/ButtonWithIcon";
import useModalChooseIsActiveShadowFeature from "./useModalChooseIsActiveShadowFeature";
import Toast from "../../messages/Toast";
import { TOAST_CONFIG_MODAL_SHADOW_FEATURE } from "../../../types/toast.type";
import ModalAddShadowFeature from "./ModalAddShadowFeature";
import type { RoleInternalType } from "../../../types/constant.type";

type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleShowModal: () => void;
  handleActive: (value: boolean) => void;
  role?: RoleInternalType;
};

const ModalChooseIsActiveShadowFeature: FC<Props> = ({
  handleCloseModal,
  modalRef,
  handleShowModal,
  handleActive,
  role,
}) => {
  const {
    dataShadowFeature,
    isLoadingShadowFeature,

    handleIsActive,
    isPendingIsActive,
    handleCloseModalAddShadowFeature,
    handleShowModalAddShadowFeature,
    modalAddShadowFeatureRef,
    handleSetToast,
    toast,
    handleNonActive,
    variablesIsActive,
  } = useModalChooseIsActiveShadowFeature({
    handleCloseModal,
    handleActive,
    role,
  });

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      {toast && (
        <Toast
          toast={toast?.id !== null}
          isAnimationOut={toast?.isAnimationOut || false}
          color={TOAST_CONFIG_MODAL_SHADOW_FEATURE[toast.type].color}
          label={TOAST_CONFIG_MODAL_SHADOW_FEATURE[toast.type].message}
        />
      )}

      <div
        className={cn(
          "modal-box lg:w-1/2 max-h-[95vh] max-w-5xl rounded-xl bg-base-100 dark:border dark:border-base-content/10 relative flex flex-col justify-start items-center",
        )}
      >
        {/* button add */}
        <div className="absolute top-3 right-3 hidden md:flex">
          <ButtonWithIcon
            icon={Plus}
            label="Tambah Pilihan"
            handleBtn={() => {
              handleShowModalAddShadowFeature();
              handleCloseModal();
            }}
          />
        </div>

        {/* title */}
        <div className="w-full flex flex-col justify-start items-center">
          {/* icon */}
          <HatGlasses className="text-base-content size-12 lg:size-18" />
          <div className="flex flex-col justify-center items-center">
            <span className="text-sm font-medium text-base-content">
              Anda akan memasuki Mode Bayangan.
            </span>
            <span className="text-xs text-base-content text-center">
              Pilih nilai potongan yang tersedia atau buat yang baru.
            </span>
          </div>
        </div>

        {/* choose */}
        <div className="mt-4 w-full flex flex-row justify-center items-stretch gap-2.5 flex-wrap ">
          {/* card choose */}
          {isLoadingShadowFeature ? (
            <>
              <div className="w-30 h-20 skeleton" />
              <div className="w-30 h-20 skeleton" />
              <div className="w-30 h-20 skeleton" />
            </>
          ) : dataShadowFeature?.data && dataShadowFeature.data?.length > 0 ? (
            dataShadowFeature.data.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={
                  item.isActive ||
                  (isPendingIsActive &&
                    variablesIsActive?.id === item.id &&
                    variablesIsActive.req.activedAt === true)
                }
                className={cn(
                  "w-28 lg:w-30 gap-2.5 rounded-2xl md:rounded-xl flex flex-col justify-between items-center p-1.5  ",
                  item.isActive === true
                    ? "bg-custom-primary text-text-custom-primary"
                    : "hover:border-custom-primary hover:-translate-y-0.5 transition-all duration-150 ease-in-out text-base-content border border-base-content",
                )}
                onClick={() =>
                  handleIsActive({
                    id: item.id,
                  })
                }
              >
                {isPendingIsActive ? (
                  <div className="loading loading-sm" />
                ) : (
                  <>
                    <span className="text-lg font-semibold">{item.nilai}%</span>
                    <span className="text-[0.625rem] lg:text-xs">
                      Potongan {item.nilai}%
                    </span>
                  </>
                )}
              </button>
            ))
          ) : (
            <span className="text-xs text-base-content/60 text-center">
              Belum ada potongan bayangan. <br /> Silakan buat potongan baru
              untuk melanjutkan.
            </span>
          )}
        </div>

        {/* button non aktif */}
        <div className="w-full mt-4 flex flex-row justify-center items-center">
          <ButtonWithIcon
            disabled={dataShadowFeature?.data?.every(
              (item) => item.isActive === false,
            )}
            customWidth="w-[80%]"
            label="Nonaktifkan Bayangan"
            bgColor="bg-error"
            textColor="text-primary-white"
            isLoading={
              isPendingIsActive && variablesIsActive?.req.deactivedAt === true
            }
            handleBtn={() => handleNonActive()}
          />
        </div>

        {/* button */}
        <div className="w-full flex flex-row justify-end items-end gap-2.5 mt-8 lg:mt-4">
          <div className="block md:hidden">
            <ButtonWithIcon
              icon={Plus}
              label="Tambah Pilihan"
              handleBtn={() => handleShowModal()}
            />
          </div>
          <ButtonCloseText handleClose={handleCloseModal} />
        </div>
      </div>

      {/* modal add */}
      <ModalAddShadowFeature
        handleCloseModal={handleCloseModalAddShadowFeature}
        modalRef={modalAddShadowFeatureRef}
        handleSetToast={handleSetToast}
        handleShowModalChoose={handleShowModal}
      />
    </dialog>
  );
};

export default ModalChooseIsActiveShadowFeature;
