import { type SetURLSearchParams } from "react-router-dom";

export const useResetParams = (setSearchParams: SetURLSearchParams) => {
  const params = new URLSearchParams();

  params.set("page", "1");

  setSearchParams(params);
};
