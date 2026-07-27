export type InputSearchRef = {
  handleReset: () => void;
};

export interface ChildRef {
  refetchActive: () => Promise<void>;
}
