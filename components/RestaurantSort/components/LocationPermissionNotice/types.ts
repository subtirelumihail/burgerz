import type { GeolocationStatus } from "@/hooks/useGeolocation";

export interface LocationPermissionNoticeProps {
  locationStatus: GeolocationStatus;
  onEnableLocation: () => void;
  isRequesting?: boolean;
}
