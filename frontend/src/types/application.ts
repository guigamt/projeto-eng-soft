export enum ApplicationStatus {
  SUBMITTED = "SUBMITTED",
  REVIEWING = "REVIEWING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  WITHDRAWN = "WITHDRAWN"
}

export interface Application {
  id: number;
  collaborator_id: number;
  project_id: number;
  pitch: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface ApplicationPayload {
  project_id: number;
  pitch: string;
}

export interface ApplicationUpdatePayload {
  status: ApplicationStatus;
}

