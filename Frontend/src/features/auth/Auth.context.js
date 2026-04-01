import { createContext } from "react";

const authContext=createContext();

const AuthProvider=({children})=>{
    [User,setUser]=useState(null);
    [loading,setLoading]=useState(false);
     
    return (
        <authContext.Provider value={{user,loading,setUser,setLoading}}>
            {children}
        </authContext.Provider>
    )
}



export {AuthProvider}