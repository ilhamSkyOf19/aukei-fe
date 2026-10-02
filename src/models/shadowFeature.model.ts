export interface CreateShadowFeatureType {
  nama?: string | null;
}

// update is active
export interface UpdateIsActiveShadowFeatureType {
  activedAt?: boolean;
  deactivedAt?: boolean;
}

// response
export interface ResponseShadowFeatureType {
  id: number;
  nama?: string | null;
  isActive: boolean;
  activedAt?: Date | null;
  deactivedAt?: Date | null;
  showNavigation: boolean;
  createdAt: Date;
  updatedAt: Date;
}
