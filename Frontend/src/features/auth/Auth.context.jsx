import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "./services/auth.api";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                if (data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                // Not authenticated, user remains null
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);return (
        <AuthContext.Provider value={{ user, loading, error, setUser, setLoading, setError }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext;
export { AuthProvider };
