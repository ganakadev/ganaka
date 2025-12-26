import { notifications } from "@mantine/notifications";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { get } from "lodash";
import { useEffect } from "react";

export const useRTKNotifier = ({
  requestName,
  error,
}: {
  requestName: string;
  error?: FetchBaseQueryError | SerializedError;
}) => {
  // EFFECTS
  useEffect(() => {
    if (error) {
      let errorMessage = "";

      if ("status" in error) {
        if (typeof error.status === "string") {
          // string status is only possible for FetchBaseQueryError
          switch (error.status) {
            case "FETCH_ERROR":
              errorMessage = "Unable to connect to server";
              break;
            case "PARSING_ERROR":
              errorMessage = "Unable to parse data recieved from server";
              break;
            case "TIMEOUT_ERROR":
              errorMessage = "Connection timed out before recieving response";
              break;
            case "CUSTOM_ERROR":
            default:
              errorMessage = "An unknown error occurred";
          }
        } else {
          // these are API sent errors
          errorMessage = get(
            error,
            "data.message",
            "An unknown error occurred"
          );
        }
      } else {
        errorMessage = error.message ?? "An unknown error occurred";
      }

      notifications.show({
        title: `${requestName}: Failed`,
        message: errorMessage,
        color: "red",
        withBorder: true,
        loading: false,
        autoClose: true,
        withCloseButton: true,
      });
    }
  }, [error, requestName]);
};
