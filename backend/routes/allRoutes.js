const express = require('express');
const router = express.Router();
const allControllers = require('../controllers/allControllers'); // 👈 your combined controller file

/* USER ROUTES */
router.post('/users/register', allControllers.createItemregister);
router.post('/users/login', allControllers.login);
router.post('/users/verify_token', allControllers.verify_token);

/* CLOTHING ROUTES */
router.post('/clothing/', allControllers.createItem); 
router.post('/clothing/:type', allControllers.getAllItems); 
router.get('/clothing/:type/:id', allControllers.getItemById); 
router.put('/clothing/:type/:id', allControllers.updateItem);
router.delete('/clothing/:type/:id', allControllers.deleteItem); 
router.post('/clothing/:type/:name', allControllers.getItemByName);

/* MATCH ROUTES */
router.post('/match/matches', allControllers.createMatch);
router.post('/match/bulk', allControllers.createMatchesBulk);
router.post('/match/', allControllers.getAllMatches);
router.get('/match/:id', allControllers.getMatchById);
router.put('/match/:id', allControllers.updateMatch);
router.delete('/match/:id', allControllers.deleteMatch);

/* TODAY ROUTES */
router.post('/today/create', allControllers.createToday);
router.post('/today/get', allControllers.getToday);

module.exports = router;
