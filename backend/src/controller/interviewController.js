let pdf = require('pdf-parse');
if (typeof pdf !== 'function') {
    pdf = pdf.default || pdf.pdfParse || pdf.PDFParse || pdf;
}
const { generateContent } = require('../services/ai.service');
const InterviewReport = require("../models/interviewReport");

async function createInterview(req, res) {
    try {
        const { jobDescription, selfDescription } = req.body;
        const resumefile = req.file;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }

        if (!resumefile && !selfDescription) {
            return res.status(400).json({ message: "Either a resume file or a self description is required" });
        }

        let resumecontent = "";
        if (resumefile) {
            try {
                // Try as a standard function first
                const resumeData = await pdf(resumefile.buffer);
                resumecontent = resumeData.text;
            } catch (error) {
                // If it's a class constructor, try with 'new'
                if (error.message.includes("without 'new'")) {
                    const Parser = pdf;
                    // Try the { data: buffer } pattern common in v2 forks
                    const instance = new Parser({ data: resumefile.buffer });
                    const resumeData = await instance.getText();
                    resumecontent = resumeData.text;
                } else {
                    throw error;
                }
            }
        }

        const interviewReportByAi = await generateContent(resumecontent, jobDescription, selfDescription);

        const newInterviewReport = await InterviewReport.create({
            user: req.user.id,
            jobDescription,
            resume: resumecontent,
            selfDescription,
            ...interviewReportByAi
        });

        res.status(200).json({
            message: "Your interview questions are ready",
            interviewReport: newInterviewReport
        });
    } catch (error) {
        console.error("Interview report error:", error);
        res.status(500).json({ message: error.message });
    }
}



async function getAllInterviews(req, res) {
    try {
        if (!req.user || !req.user.id) {
            console.error("AI History Error: No user ID in request");
            return res.status(401).json({ message: "Authentication required" });
        }

        console.log("AI History: Fetching reports for user:", req.user.id);
        
        // Find all reports belonging to the authenticated user, newest first
        const interviews = await InterviewReport.find({ user: req.user.id })
            .select('jobDescription matchScore matchAnalysis createdAt') 
            .sort({ createdAt: -1 });
            
        console.log(`AI History: Found ${interviews.length} reports`);
        res.status(200).json({ interviews });
    } catch (error) {
        console.error("AI History Controller Error:", error);
        res.status(500).json({ message: error.message });
    }
}

async function getInterview(req, res) {
    try {
        const { interviewId } = req.params;
        // Ensure the report belongs to the requesting user
        const interviewReport = await InterviewReport.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        });
        
        if (!interviewReport) {
            return res.status(404).json({ message: "We couldn't find that interview plan" });
        }

        res.status(200).json({
            interviewReport
        });
    } catch (error) {
        console.error("Get interview error:", error);
        res.status(500).json({ message: error.message });
    }
}

async function tailorResumeController(req, res) {
    try {
        const { jobDescription, selfDescription } = req.body;
        const resumefile = req.file;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" });
        }

        let resumecontent = "";
        if (resumefile) {
            try {
                const resumeData = await pdf(resumefile.buffer);
                resumecontent = resumeData.text;
            } catch (error) {
                console.error("PDF Parse Error:", error);
            }
        }

        const tailoredResume = await require('../services/ai.service').tailorResume(resumecontent, jobDescription, selfDescription);

        res.status(200).json({
            message: "Your resume has been improved",
            tailoredResume
        });
    } catch (error) {
        console.error("Tailor resume error:", error);
        res.status(500).json({ message: error.message });
    }
}

async function deleteInterview(req, res) {
    try {
        const { interviewId } = req.params;
        const deletedReport = await InterviewReport.findOneAndDelete({ 
            _id: interviewId, 
            user: req.user.id 
        });
        
        if (!deletedReport) {
            return res.status(404).json({ message: "We couldn't find that interview plan to delete" });
        }

        res.status(200).json({ message: "Your interview plan has been deleted" });
    } catch (error) {
        console.error("Delete interview error:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createInterview,
    getInterview,
    getAllInterviews,
    tailorResumeController,
    deleteInterview
};