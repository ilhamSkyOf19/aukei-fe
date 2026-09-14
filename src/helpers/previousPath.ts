export const savePreviousPath = (pathname: string, search: string) => {
  sessionStorage.setItem("previous-path", `${pathname}${search}`);
};

export const getPreviousPath = () => {
  return sessionStorage.getItem("previous-path");
};

// remove
export const removePreviousPath = () => {
  sessionStorage.removeItem("previous-path");
};
