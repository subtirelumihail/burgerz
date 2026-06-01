import { HiOutlineLocationMarker } from "react-icons/hi";

import { Button } from "@/components/basic";
import type { GeolocationStatus } from "@/hooks/useGeolocation";

import type { LocationPermissionNoticeProps } from "./types";

import styles from "./LocationPermissionNotice.module.css";

function getNoticeContent(status: GeolocationStatus): {
  message: string;
  actionLabel: string;
  showAction: boolean;
} {
  if (status === "denied") {
    return {
      message:
        "Location access is blocked for this site. To sort restaurants by distance, enable it in Chrome: click the lock icon in the address bar, open Site settings, set Location to Allow, then click Try again below.",
      actionLabel: "Try again",
      showAction: true,
    };
  }

  if (status === "unavailable") {
    return {
      message:
        "Location is unavailable in this browser. Sorting by distance is not supported here.",
      actionLabel: "Enable location",
      showAction: false,
    };
  }

  return {
    message:
      "Location access is needed to sort restaurants by distance. Click Enable location below and allow access when Chrome prompts you.",
    actionLabel: "Enable location",
    showAction: true,
  };
}

export function LocationPermissionNotice({
  locationStatus,
  onEnableLocation,
  isRequesting = false,
}: LocationPermissionNoticeProps) {
  const messageId = "location-permission-notice-message";
  const { message, actionLabel, showAction } = getNoticeContent(locationStatus);

  return (
    <div
      role="group"
      aria-labelledby={messageId}
      tabIndex={0}
      className={styles.root}
    >
      <HiOutlineLocationMarker className={styles.icon} aria-hidden />
      <div className={styles.content}>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        {showAction ? (
          <Button
            type="button"
            variant="secondary"
            className={styles.button}
            onClick={onEnableLocation}
            isLoading={isRequesting}
            disabled={isRequesting}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
