import { profilesHttp } from "./http";
import {
  CollaboratorPayload,
  CollaboratorProfile,
  InterestPayload,
  PortfolioItem,
  PortfolioPayload,
  Skill,
  SkillPayload
} from "../types/collaborator";

const basePath = "/api/profiles/collaborators";

export const collaboratorApi = {
  get: async () => {
    const { data } = await profilesHttp.get<CollaboratorProfile>(`${basePath}/me`);
    return data;
  },
  create: async (payload: CollaboratorPayload) => {
    const { data } = await profilesHttp.post<CollaboratorProfile>(basePath, payload);
    return data;
  },
  update: async (payload: CollaboratorPayload) => {
    const { data } = await profilesHttp.put<CollaboratorProfile>(
      `${basePath}/me`,
      payload
    );
    return data;
  },
  addSkill: async (payload: SkillPayload) => {
    const { data } = await profilesHttp.post<Skill>(`${basePath}/me/skills`, payload);
    return data;
  },
  removeSkill: async (skillId: number) => {
    await profilesHttp.delete(`${basePath}/me/skills/${skillId}`);
  },
  addInterest: async (payload: InterestPayload) => {
    const { data } = await profilesHttp.post(`${basePath}/me/interests`, payload);
    return data;
  },
  removeInterest: async (interestId: number) => {
    await profilesHttp.delete(`${basePath}/me/interests/${interestId}`);
  },
  addPortfolioItem: async (payload: PortfolioPayload) => {
    const { data } = await profilesHttp.post<PortfolioItem>(
      `${basePath}/me/portfolio`,
      payload
    );
    return data;
  },
  removePortfolioItem: async (itemId: number) => {
    await profilesHttp.delete(`${basePath}/me/portfolio/${itemId}`);
  }
};
