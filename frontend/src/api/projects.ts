import { projectsHttp } from "./http";
import { Project } from "../types/project";

export const projectsApi = {
  list: async () => {
    const { data } = await projectsHttp.get<Project[]>("/projects");
    return data;
  }
};
