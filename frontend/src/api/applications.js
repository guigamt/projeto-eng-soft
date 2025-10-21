import { applicationsHttp } from "./http";
const basePath = "/applications";
export const applicationsApi = {
    create: async (payload) => {
        const { data } = await applicationsHttp.post(basePath, payload);
        return data;
    },
    listMine: async () => {
        const { data } = await applicationsHttp.get(`${basePath}/me`);
        return data;
    },
    update: async (id, payload) => {
        const { data } = await applicationsHttp.patch(`${basePath}/${id}`, payload);
        return data;
    }
};
