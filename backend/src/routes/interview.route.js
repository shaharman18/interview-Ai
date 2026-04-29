const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const interviewController = require('../controller/interviewController');
const upload = require('../middleware/file.middleware');
const interviewRouter = express.Router();


interviewRouter.post('/',authMiddleware,upload.single('resume'),interviewController.createInterview);
interviewRouter.post('/tailor', authMiddleware, upload.single('resume'), interviewController.tailorResumeController);
interviewRouter.get('/', authMiddleware, interviewController.getAllInterviews);
interviewRouter.get('/:interviewId',authMiddleware,interviewController.getInterview);
interviewRouter.delete('/:interviewId', authMiddleware, interviewController.deleteInterview);

module.exports =interviewRouter;
