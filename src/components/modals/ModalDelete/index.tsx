import { AlertCircle } from "lucide-react";
import { useState, type FC, type RefObject } from "react";
import clsx from "clsx";
import { cn } from "../../../utils/cn";
import ButtonDelete from "../../ui/button/ButtonDelete";
import ButtonCloseText from "../../ui/button/ButtonCloseText";
import ErrorMessage from "../../messages/ErrorMessage";
type Props = {
  modalRef: RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  handleDelete: () => Promise<void>;
  isLoadingDelete?: boolean;
  bigTitle?: string;
  listData?: string[];
  normalMessage?: boolean;
  kataKunci?: string;
  highlightData?: string;
  highlightDatas?: string[];
};
const ModalDelete: FC<Props> = ({
  handleCloseModal,
  modalRef,
  handleDelete,
  isLoadingDelete,
  bigTitle,
  listData,
  kataKunci,
  normalMessage,
  highlightData,
  highlightDatas,
}) => {
  // state error
  const [isError, setIsError] = useState<boolean>(false);
  // state input
  const [isInputValue, setIsInputValue] = useState<string>("");

  // handle next
  const handleNext = () => {
    if (kataKunci) {
      if (isInputValue.trim() === kataKunci) {
        setIsError(false);
        handleDelete();
      } else {
        setIsError(true);
      }
    } else {
      handleDelete();
    }
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div
        className={cn(
          "modal-box bg-base-200 dark:border dark:border-base-content/10",
          kataKunci ? "w-11/12 lg:w-130" : "w-11/12 lg:w-110",
        )}
      >
        {/* icon alert */}
        <div className="w-full flex justify-center mb-4">
          <AlertCircle className="size-20 text-error" />
        </div>
        <h3 className="font-semibold text-base-content text-sm lg:text-lg text-center mb-4">
          {bigTitle || "Apakah anda yakin ingin menghapus data ini?"}
        </h3>
        {/* highlight data */}

        {highlightData && (
          <div className="w-full flex flex-row justify-center items-center">
            <p className="text-base text-error font-semibold">
              {highlightData}
            </p>
          </div>
        )}

        {highlightDatas && (
          <div className="w-full flex flex-col justify-center items-center">
            {highlightDatas.map((item, index) => (
              <p key={index} className="text-base text-error font-semibold">
                {item}
              </p>
            ))}
          </div>
        )}

        {/* content */}
        {normalMessage && (
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="text-sm text-error font-medium">Peringatan :</span>
            <span className="text-sm text-base-content">
              Data akan dihapus secara permanen dan tidak dapat dipulihkan
              kembali.
            </span>
          </div>
        )}

        {listData && (
          <div className="w-ful flex flex-col justify-start items-start">
            <span className="text-sm font-medium text-base-content">
              Data ini memiliki keterkaitan dengan:
            </span>

            <ul className="list-disc pl-5 mt-2 mb-5">
              {listData.map((item, index) => (
                <li
                  key={index}
                  className="text-sm font-semibold text-base-content"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-sm text-error font-medium">
                Peringatan :
              </span>
              <span className="text-sm text-base-content">
                Jika data ini dihapus, seluruh data yang terkait juga akan ikut
                terhapus dan tidak dapat dipulihkan kembali.
              </span>
            </div>
          </div>
        )}

        {/* input kata kunci */}
        {kataKunci && (
          <div className="w-full flex flex-col justify-start items-start mt-4">
            {/* label */}
            <p className="text-sm text-base-content">
              Masukan kata " <span className="font-medium">{kataKunci}</span> "
              untuk melanjutkan.
            </p>

            {/* input */}
            <div
              className={clsx(
                "mt-2 h-10 px-3 flex flex-row justify-start items-center gap-2 border border-base-content/50 rounded-md w-full focus-within:ring-1 focus-within:ring-primary-purple focus-within:border-primary-purple transition-all duration-300 ease-in-out bg-base-100",
                isError && "border-error",
              )}
            >
              <input
                type={"text"}
                placeholder={"Masukan kata kunci"}
                className="w-full text-base-content h-full border-none outline-none text-sm placeholder:text-sm placeholder:text-base-content/50 placeholder:font-light lg:text-sm"
                maxLength={100}
                onChange={(e) => {
                  let value = e.target.value;
                  // set value
                  setIsInputValue(value);
                }}
                value={isInputValue}
                autoComplete="off"
              />
            </div>

            {/* error */}
            <ErrorMessage errorMessage={isError ? "Kata kunci salah" : ""} />
          </div>
        )}

        <div className="w-full flex flex-row justify-end items-end gap-2 mt-8">
          {/* button close */}
          <ButtonCloseText
            handleClose={handleCloseModal}
            disabled={isLoadingDelete}
          />

          {/* button delete */}
          <ButtonDelete handleDelete={handleNext} isLoading={isLoadingDelete} />
        </div>
      </div>
    </dialog>
  );
};

export default ModalDelete;
