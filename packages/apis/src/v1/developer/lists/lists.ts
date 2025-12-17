import { v1_developer_lists_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";
import { API_DOMAIN } from "../../../utils/constants";

// ==================== GET /lists ====================

export const getLists =
  (developerKey: string) => async (type: "top-gainers" | "volume-shockers") => {
    const params: z.infer<typeof v1_developer_lists_schemas.getLists.query> = {
      type,
    };

    return axios.get<
      z.infer<typeof v1_developer_lists_schemas.getLists.response>
    >(`${API_DOMAIN}/v1/developer/lists`, {
      params,
      headers: {
        Authorization: `Bearer ${developerKey}`,
      },
    });
  };
