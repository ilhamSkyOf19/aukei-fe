import type { FC } from "react";
import {
  STATUS_INVENTORI_TYPE,
  type StatusInventoriType,
} from "../../../types/constant.type";
import LabelButtonDropDownWithIcon from "../button/LabelButtonDropDownWithIcon";
import { Trash, View } from "lucide-react";

type DropDownProps = {
  handleRedirectDetail: () => void;
  status: StatusInventoriType;
  handleShowModalDelete?: () => void;
};
const DropDownInventori: FC<DropDownProps> = ({
  handleRedirectDetail,
  handleShowModalDelete,
  status,
}) => {
  return (
    <ul
      tabIndex={-1}
      className="z-50 dark:border dark:border-base-content/10 dropdown-content menu bg-base-100 rounded-box w-40 lg:w-50 p-2 shadow-sm space-y-2 absolute"
    >
      <li>
        <LabelButtonDropDownWithIcon
          label="Detail"
          icon={View}
          handleClick={() => handleRedirectDetail()}
        />
      </li>
      {status === STATUS_INVENTORI_TYPE.DRAFT && handleShowModalDelete && (
        <li>
          <LabelButtonDropDownWithIcon
            color="text-error"
            label="Hapus"
            icon={Trash}
            handleClick={() => handleShowModalDelete()}
          />
        </li>
      )}
    </ul>
  );
};

export default DropDownInventori;
