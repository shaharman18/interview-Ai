import { use, useContext, useEffect } from "react"
import authContext from "../Auth.context"
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    updateUserProfile,
    sendRegisterOTP,
    forgotPassword,
    resetPassword
} from "../services/auth.api"

const useAuth = () => {
    const context = useContext(authContext);
    const { user, loading, error, setUser, setLoading, setError } = context;

    const handleSendOTP = async (email) => {
        setLoading(true);
        setError(null);
        try {
            await sendRegisterOTP(email);
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send OTP";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (name, email, password, otp) => {
        setLoading(true);
        setError(null);
        try {
            const data = await registerUser({ name, email, password, otp });
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser({ email, password });
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Invalid email or password";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            await forgotPassword(email);
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset OTP";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (email, otp, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            await resetPassword({ email, otp, newPassword });
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Password reset failed";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (name, email) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updateUserProfile({ name, email });
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Profile update failed";
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
            setError(null);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getandSetUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch (error) {}
            finally {
                setLoading(false);
            }
        }
        getandSetUser()
    }, []);

    return { 
        user, loading, error, 
        handleLogin, handleRegister, handleLogout, 
        handleUpdateProfile, handleSendOTP, 
        handleForgotPassword, handleResetPassword,
        setError 
    };
}

export { useAuth }
