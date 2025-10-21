export type ProjectTag =
  | "ia"
  | "backend"
  | "educacao"
  | "mobile"
  | "ux"
  | "psicologia"
  | "datascience"
  | "frontend"
  | "sustentabilidade";

export interface Project {
  id: number;
  name: string;
  headline: string;
  tags: ProjectTag[];
  owner: string;
  slots: number;
  remote: boolean;
  location?: string;
  description: string;
}

