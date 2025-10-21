import { WorkMode } from "./enums";
import { ProjectTag } from "./project";

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface Interest {
  id: number;
  slug: string;
  label: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  thumb_url?: string;
}

export interface CollaboratorProfile {
  id: number;
  user_id: number;
  headline?: string;
  bio?: string;
  location_city?: string;
  location_state?: string;
  availability_hours_per_week?: number;
  work_mode?: WorkMode;
  skills: Skill[];
  interests: Interest[];
  portfolio_items: PortfolioItem[];
}

export interface CollaboratorPayload {
  headline?: string;
  bio?: string;
  location_city?: string;
  location_state?: string;
  availability_hours_per_week?: number;
  work_mode?: WorkMode;
}

export interface SkillPayload {
  name: string;
  level: number;
}

export interface InterestPayload {
  slug: ProjectTag;
  label: string;
}

export interface PortfolioPayload {
  title: string;
  url: string;
  description?: string;
  thumb_url?: string;
}

