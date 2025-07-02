const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {getAllIncidents , createIncident , updateIncident} = require('../controllers/Incident');

router.get('/' , getAllIncidents);
router.post('/create' ,auth, createIncident);
router.get('/:id' , updateIncident);

module.exports = router;