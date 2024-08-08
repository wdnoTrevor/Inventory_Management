const express = require('express');
const router = express.Router();

// Render the area generator form
router.get('/', (req, res) => {
    res.render('area/areaGenerator');
});

router.get('/create', (req, res) => {
    res.render('area/areaGenerator');
});

router.get('/:id', (req, res) => {
    res.render('area/areaGenerator');
});

router.get('/:id/update', (req, res) => {
    res.render('area/areaGenerator');
});

router.get('/:id/beds', (req, res) => {
    res.render('area/areaGenerator');
});

module.exports = router;
