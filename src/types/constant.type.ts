// role internal
export const ROLE_INTERNAL_TYPE = {
  OWNER: "OWNER",
  KASIR: "KASIR",
} as const;

// type role
export type RoleInternalType =
  (typeof ROLE_INTERNAL_TYPE)[keyof typeof ROLE_INTERNAL_TYPE];

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
