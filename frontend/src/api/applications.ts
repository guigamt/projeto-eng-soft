import { applicationsHttp } from "./http";
import {
  Application,
  ApplicationPayload,
  ApplicationUpdatePayload
} from "../types/application";

const basePath = "/applications";

export const applicationsApi = {
  create: async (payload: ApplicationPayload) => {
    const { data } = await applicationsHttp.post<Application>(basePath, payload);
    return data;
  },
  listMine: async () => {
    const { data } = await applicationsHttp.get<Application[]>(
      `${basePath}/me`
    );
    return data;
  },
  update: async (id: number, payload: ApplicationUpdatePayload) => {
    const { data } = await applicationsHttp.patch<Application>(
      `${basePath}/${id}`,
      payload
    );
    return data;
  }
};
