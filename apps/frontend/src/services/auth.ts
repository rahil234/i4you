import api from "@/lib/api";
import axios from "axios";

interface Error {
    readonly response: {
        readonly data: string;
    }
    readonly status: number;
    readonly message: string;
}

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", {email, password}, {withCredentials: true});
        return {data: response.data, error: null};
    } catch (error) {
        console.log("Error: ", error);
        if ((error as Error).status === 401) {
            return {data: null, error: "Invalid username or password"};
        }
        return {data: null, error: (error as Error).message};
    }
};

export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post("/auth/register", {name, email, password});
        return {data: response.data, error: null};
    } catch (error) {
        return {data: null, error: (error as Error).message};
    }
}

export const getUser = async () => {
    try {
        const response = await api.get("/user/me");
        console.log("me res", response)
        return {data: response.data, error: null};
    } catch (error) {
        return {data: null, error: (error as Error).message};
    }
};

export const logout = async () => {
    await api.post("/auth/logout", {},
        {withCredentials: true}
    );
};

export const refreshToken = async () => {
    const baseURL = process.env.VUE_APP_AUTH_SERVER_URL || "http://localhost:4000/api/v1";
    try {
        const response = await axios.get(`${baseURL}/auth/refresh-token`, {
            withCredentials: true
        });
        return {data: response.data, error: null};
    } catch (error) {
        return {data: null, error: (error as Error).message};
    }
};

export default {
    login,
    register,
    getUser,
    logout,
    refreshToken
}
