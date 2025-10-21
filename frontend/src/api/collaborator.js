import { profilesHttp } from "./http";
const basePath = "/api/profiles/collaborators";
export const collaboratorApi = {
    get: async () => {
        const { data } = await profilesHttp.get(`${basePath}/me`);
        return data;
    },
    create: async (payload) => {
        const { data } = await profilesHttp.post(basePath, payload);
        return data;
    },
    update: async (payload) => {
        const { data } = await profilesHttp.put(`${basePath}/me`, payload);
        return data;
    },
    addSkill: async (payload) => {
        const { data } = await profilesHttp.post(`${basePath}/me/skills`, payload);
        return data;
    },
    removeSkill: async (skillId) => {
        await profilesHttp.delete(`${basePath}/me/skills/${skillId}`);
    },
    addInterest: async (payload) => {
        const { data } = await profilesHttp.post(`${basePath}/me/interests`, payload);
        return data;
    },
    removeInterest: async (interestId) => {
        await profilesHttp.delete(`${basePath}/me/interests/${interestId}`);
    },
    addPortfolioItem: async (payload) => {
        const { data } = await profilesHttp.post(`${basePath}/me/portfolio`, payload);
        return data;
    },
    removePortfolioItem: async (itemId) => {
        await profilesHttp.delete(`${basePath}/me/portfolio/${itemId}`);
    }
};
