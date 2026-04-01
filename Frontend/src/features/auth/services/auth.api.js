import axios from "axios";
const API= axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  },
    withCredentials: true
});



export  async function registerUser({name,email,password}){
    try {
        const response = await API.post("/api/auth/register", { name, email, password }, {
            headers: {
                "Content-Type": "application/json",
            }
          
        }); 
        
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}


export  async function loginUser({email,password}){
    try {
        const response = await API.post("/api/auth/login", { email, password }, {
            headers: {
                "Content-Type": "application/json",
            }
        }); 
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await axios.post("/api/auth/logout", {}, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await axios.get("/api/auth/me", {  
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}