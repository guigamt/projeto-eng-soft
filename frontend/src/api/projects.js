import { projectsHttp } from "./http";
export const projectsApi = {
    list: async () => {
        const { data } = await projectsHttp.get("/projects");
        return data;
    }
};
