const express = require("express");
const { getEveryThing, createContact, postRequests, getRequests } = require("../controller/controller");
const router = express.Router();




router.post('/bfhl',postRequests);
router.get('/bfhl',getRequests);

module.exports = router;