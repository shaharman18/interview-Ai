import API from "../../../api/axios";

export const createInterview = async (formData) => {
    try {
        const response = await API.post("/interviews", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating interview:", error);
        throw error;
    }
};

export const getInterview = async (interviewId) => {
    try {
        const response = await API.get(`/interviews/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching interview:", error);
        throw error;
    }
};

export const getAllInterviews = async () => {
    try {
        const response = await API.get("/interviews");
        return response.data;
    } catch (error) {
        console.error("Error fetching interviews:", error);
        throw error;
    }
};

export const tailorResume = async (formData) => {
    try {
        const response = await API.post("/interviews/tailor", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error tailoring resume:", error);
        throw error;
    }
};
export const deleteInterview = async (interviewId) => {
    try {
        const response = await API.delete(`/interviews/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting interview:", error);
        throw error;
    }
};
