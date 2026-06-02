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
