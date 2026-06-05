// role internal
export const ROLE_INTERNAL_TYPE = {
  OWNER: "OWNER",
  KASIR: "KASIR",
} as const;

// type role
export type RoleInternalType =
  (typeof ROLE_INTERNAL_TYPE)[keyof typeof ROLE_INTERNAL_TYPE];

// status barang masuk
export const STATUS_INVENTORI_TYPE = {
  DRAFT: "DRAFT",
  POSTED: "POSTED",
} as const;

// type status barang masuk
export type StatusInventoriType =
  (typeof STATUS_INVENTORI_TYPE)[keyof typeof STATUS_INVENTORI_TYPE];

// outlet context type
export type OutletContextType = {
  handleTitle: (title: string) => void;
};

// meta type
// pagination
export interface MetaType {
  totalData: number;
  currentPage: number;
  totalPage: number;
  limit: number;
}

// max file size 2 MB
export const MAX_FILE_SIZE_IMG = 3 * 1024 * 1024;
