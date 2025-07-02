const express = require("express")
const router = express.Router();
const HomeRoute = require('./HomeRouter');
const AuthRouter = require('./AuthRouter');
const UserRouter = require('./UserRouter');
const CommunityRouter = require('./CommunityRouter');
const IncidentRoute = require('./IncidentRouter');
const AnnouncementRouter = require('./AnnouncementRouter');
const FloodVerificationRouter = require('./floodVerification');

router.use("/home",HomeRoute)
router.use("/auth",AuthRouter)
router.use("/users", UserRouter)
router.use("/community",CommunityRouter)
router.use("/incident",IncidentRoute)
router.use("/announcements", AnnouncementRouter)
router.use("/flood", FloodVerificationRouter)

module.exports = router;
