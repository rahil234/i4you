import axios from "axios"
import {useAuthStore} from "@/store"

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1"

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const {accessToken} = useAuthStore.getState()

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const newToken = await useAuthStore.getState().refreshToken();
                    isRefreshing = false;

                    if (newToken) {
                        onTokenRefreshed(newToken);
                        return api(originalRequest); // Retry failed request
                    }
                } else {
                    return new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(api(originalRequest)); // Retry with new token
                        });
                    });
                }
            } catch (refreshError) {
                await useAuthStore.getState().logout(); // Logout on refresh failure
            }
        }

        return Promise.reject(error);
    }
);


// Response interceptor
// api.interceptors.response.use(
//     (response) => {
//         return response
//     },
//     async (error: AxiosError) => {
//         const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
//
//         // If error is 401, and we haven't retried yet
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true
//
//             try {
//                 // Get a new token
//                 // const newToken = await useAuthStore.getState().refreshToken()
//
//                 // Update the request with the new token
//                 // if (originalRequest.headers) {
//                 //   originalRequest.headers.Authorization = `Bearer ${newToken}`
//                 // }
//
//                 // Retry the request
//                 return api(originalRequest)
//             } catch (refreshError) {
//                 // If refresh token fails, logout the user
//                 useAuthStore.getState().logout()
//                 return Promise.reject(refreshError)
//             }
//         }
//
//         return Promise.reject(error)
//     },
// )

export default api
