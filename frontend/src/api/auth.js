import { authHttp } from "./http";
export const authApi = {
    async login(payload) {
        const { data } = await authHttp.post("/login", payload);
        return data;
    },
    async register(payload) {
        const { data } = await authHttp.post("/register", payload);
        return data;
    },
    async logout() {
        const { data } = await authHttp.post("/logout");
        return data;
    },
    async me() {
        const { data } = await authHttp.get("/me");
        return data;
    }
};
