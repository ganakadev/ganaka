import { v1_developer_lists_schemas } from "@ganaka/schemas";
import axios from "axios";
import z from "zod";

// ==================== GET /lists ====================

export const getLists = async (type: "top-gainers" | "volume-shockers") => {
  const params: z.infer<typeof v1_developer_lists_schemas.getLists.query> = {
    type,
  };

  return axios.get<
    z.infer<typeof v1_developer_lists_schemas.getLists.response>
  >(`https://groww.in/markets/${type}?index=GIDXNIFTYTOTALMCAP`, {
    params,
  });
};
