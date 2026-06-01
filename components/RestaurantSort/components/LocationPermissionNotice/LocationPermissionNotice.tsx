import { HiOutlineLocationMarker } from "react-icons/hi";

import { Button } from "@/components/basic";

import type { LocationPermissionNoticeProps } from "./types";

import styles from "./LocationPermissionNotice.module.css";

export function LocationPermissionNotice({
  onEnableLocation,
  isRequesting = false,
}: LocationPermissionNoticeProps) {
  return (
    <div className={styles.root} role="status">
      <HiOutlineLocationMarker className={styles.icon} aria-hidden />
      <div className={styles.content}>
        <p className={styles.message}>
          Location access is needed to sort restaurants by distance. If you
          blocked the prompt, click below to try again or allow location in your
          browser site settings.
        </p>
        <Button
          type="button"
          variant="secondary"
          className={styles.button}
          onClick={onEnableLocation}
          isLoading={isRequesting}
          disabled={isRequesting}
        >
          Enable location
        </Button>
      </div>
    </div>
  );
}
