import axios, { AxiosInstance } from "axios";

const defaultUserId = import.meta.env.APP_USER_ID ?? "1";

const createClient = (baseURL: string): AxiosInstance =>
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": defaultUserId
    }
  });

export const profilesHttp = createClient(
  import.meta.env.APP_PROFILES_API_URL ?? "http://localhost:8002"
);

export const projectsHttp = createClient(
  import.meta.env.APP_PROJECTS_API_URL ?? "http://localhost:8003"
);

export const applicationsHttp = createClient(
  import.meta.env.APP_APPLICATIONS_API_URL ?? "http://localhost:8004"
);

export const matchHttp = createClient(
  import.meta.env.APP_MATCH_API_URL ?? "http://localhost:8005"
);

export const gatewayHttp = createClient(
  import.meta.env.APP_GATEWAY_API_URL ?? "http://localhost:8000"
);
