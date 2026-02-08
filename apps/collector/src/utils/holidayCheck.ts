import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { API_DOMAIN, DEVELOPER_KEY } from "./constants";

dayjs.extend(utc);
dayjs.extend(timezone);

export const holidayCheck = async (): Promise<boolean> => {
  try {
    // Get current date in IST timezone
    const nowIST = dayjs().tz("Asia/Kolkata");
    const dateStr = nowIST.format("YYYY-MM-DD");

    const response = await axios.get(`${API_DOMAIN}/v1/holidays/check`, {
      params: {
        date: dateStr,
      },
      headers: {
        Authorization: `Bearer ${DEVELOPER_KEY}`,
      },
      timeout: 5000, // 5 second timeout
    });

    if (response.data && response.data.data) {
      return response.data.data.isHoliday === true;
    }
    return false;
  } catch (error) {
    // If API is unavailable or validation fails, log and continue (fail gracefully)
    console.warn("Failed to check holiday status, continuing with collection:", error);
    return false;
  }
};
