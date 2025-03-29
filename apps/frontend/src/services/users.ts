import api from "@/lib/api";

export const getUsers = async () => {
    try {
        const response = await api.get("/user/admin/user");
        return {data: response.data, error: null};
    } catch (error) {
        return {error: error, data: null};
    }
}


