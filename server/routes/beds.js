const express = require('express');
const router = express.Router();
const FarmBed = require('../../models/farmBed');
const Product = require('../../models/product');
const NestObject = require('../../utils/dataTrans');

// Get all beds
router.get('/', async (req, res) => {
    const farmBed = await FarmBed.find({});
    res.render('beds/home', { farmBed });
});

// Create a new bed form
router.get('/create', async (req, res) => {
    res.render('beds/bCreate');
});

// Get a specific bed
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const farmBed = await FarmBed.findById(id);
    const products = await Product.aggregate([
        { $match: { author: farmBed._id } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$name", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } }
    ]);
    res.render('beds/bDetails', { farmBed, products });
});

// Update a specific bed form
router.get('/:id/update', async (req, res) => {
    const { id } = req.params;
    const farmBed = await FarmBed.findById(id);
    res.render('beds/bUpdate', { farmBed });
});

// Create a new bed
router.post('/', async (req, res) => {
    const data = NestObject(req.body);
    const { name } = data.bed;

    try {
        const existingBed = await FarmBed.findOne({ 'bed.name': name });
        if (!existingBed) {
            const createBed = new FarmBed(data);
            await createBed.save();
            console.log('Bed created:', data.bed.name);
        } else {
            console.log('Bed with this name already exists:', data.bed.name);
            return res.status(400).json({ message: 'Bed name must be unique' });
        }
        res.redirect('/beds');
    } catch (error) {
        console.error('Error creating bed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a specific bed
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const incoming = req.body;
    const createBed = await FarmBed.findByIdAndUpdate(id, incoming, { runValidators: true, new: true });
    res.redirect(`/beds/${createBed._id}`);
});

// Delete a specific bed
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await FarmBed.findByIdAndDelete(id);
    res.redirect('/beds');
});

module.exports = router;
