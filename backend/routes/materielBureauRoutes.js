// backend/routes/materielBureau.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/materielBurContro');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/assigner', controller.assignerUtilisateur);

module.exports = router;