import axios from "axios";
const createClient = (baseURL) => axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});
let bearerToken = null;
let userIdHeader = null;
const clients = [];
const applyDefaults = (client) => {
    if (bearerToken) {
        client.defaults.headers.Authorization = `Bearer ${bearerToken}`;
    }
    else {
        delete client.defaults.headers.Authorization;
    }
    if (userIdHeader) {
        client.defaults.headers["X-User-Id"] = userIdHeader;
    }
    else {
        delete client.defaults.headers["X-User-Id"];
    }
};
const registerClient = (client) => {
    clients.push(client);
    applyDefaults(client);
    return client;
};
const updateAllClients = () => {
    clients.forEach(applyDefaults);
};
export const setAuthToken = (token) => {
    bearerToken = token;
    updateAllClients();
};
export const setAuthUserId = (userId) => {
    userIdHeader = userId !== null ? String(userId) : null;
    updateAllClients();
};
export const authHttp = registerClient(createClient(import.meta.env.APP_AUTH_API_URL ?? "http://localhost:8001/auth"));
export const profilesHttp = registerClient(createClient(import.meta.env.APP_PROFILES_API_URL ?? "http://localhost:8002"));
export const projectsHttp = registerClient(createClient(import.meta.env.APP_PROJECTS_API_URL ?? "http://localhost:8003"));
export const applicationsHttp = registerClient(createClient(import.meta.env.APP_APPLICATIONS_API_URL ?? "http://localhost:8004"));
export const matchHttp = registerClient(createClient(import.meta.env.APP_MATCH_API_URL ?? "http://localhost:8005"));
export const gatewayHttp = registerClient(createClient(import.meta.env.APP_GATEWAY_API_URL ?? "http://localhost:8000"));
