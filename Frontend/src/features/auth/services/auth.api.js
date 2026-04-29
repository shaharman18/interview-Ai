import API from "../../../api/axios";

export async function sendRegisterOTP(email) {
    const response = await API.post("/auth/send-otp", { email });
    return response.data;
}

export async function registerUser({ name, email, password, otp }) {
    const response = await API.post("/auth/register", { username: name, email, password, otp });
    return response.data;
}

export async function loginUser({ email, password }) {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
}

export async function logoutUser() {
    const response = await API.post("/auth/logout", {});
    return response.data;
}

export async function getCurrentUser() {
    try {
        const response = await API.get("/auth/getme");
        return response.data;
    } catch (error) {
        if (!error.response || error.response.status === 401) {
            return { user: null };
        }
        throw error;
    }
}

export async function updateUserProfile({ name, email }) {
    const response = await API.put("/auth/update-profile", { username: name, email });
    return response.data;
}

export async function forgotPassword(email) {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
}

export async function resetPassword({ email, otp, newPassword }) {
    const response = await API.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
}