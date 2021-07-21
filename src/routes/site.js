const express = require('express')
const router = express.Router()
const siteController = require('../app/controller/SiteController')

 router.use('/admin', siteController.manager);
 router.use('/', siteController.home);

module.exports = router;