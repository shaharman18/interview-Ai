import { use, useContext } from "react"
import authContext from "./Auth.context"
import  { registerUser, loginUser, logoutUser, fetchCurrentUser } from "../services/auth.api"
const useAuth = () => {
    const context = useContext(authContext);
    const { user, loading, setUser, setLoading } = context;


    const handleLogin=async (email, password) => {
   setLoading(true);
   try {
     const data = await loginUser({ email, password });
     setUser(data.user);
   } catch (error) { 
     console.error("Login error:", error);
   } finally {
     setLoading(false);
   }
    };
const handleRegister=async (name,email,password) => {
    setLoading(true);   
    try {
        const data = await registerUser({ name,email,password });
        setUser(data.user);
    } catch (error) {
        console.error("Registration error:", error);
    }
    finally {
        setLoading(false);
    }
}

const handleLogout=async () => {
    setLoading(true);   
    try {
        await logoutUser();
        setUser(null);
    } catch (error) {
        console.error("Logout error:", error);
    }   
    finally {
        setLoading(false);
    }
}

const fetchUser=async () => {
    setLoading(true);   
    try {
        const data = await fetchCurrentUser();
        setUser(data.user);
    } catch (error) {
        console.error("Fetch user error:", error);
    }
    finally {
        setLoading(false);
    }
}

return{ user, loading, handleLogin, handleRegister, handleLogout, fetchUser };
}
