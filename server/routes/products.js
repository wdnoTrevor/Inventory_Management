const express = require('express');
const router = express.Router();
const FarmBed = require('../../models/farmBed');
const Product = require('../../models/product');
const getTotalWeights = require('../../utils/aggregate');

// Get products for a specific bed
router.get('/:id/products', async (req, res) => {
    const { id } = req.params;
    const farmBed = await FarmBed.findById(id);
    const products = await Product.find({ author: id }).populate('author');
    const totals = await getTotalWeights();
    res.render('products/pHome', { products, farmBed });
});

// Create a new product
router.get('/:id/product/create', async (req, res) => {
    const { id } = req.params;
    const farmBed = await FarmBed.findById(id);
    res.render('products/pCreate', { farmBed });
});

router.post('/:id/products', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { name, weight, input } = data;

    let findProduct = await Product.findOne({ name: data.name }).sort({ createdAt: -1 });

    if (findProduct) {
        const oldTotal = findProduct.totalWeight;
        const newWeight = data.weight;
        const total = Number(oldTotal) + Number(newWeight);
        const totalSubWeight = Number(oldTotal) - Number(newWeight);

        function Input(addOrsub) {
            const additionalData = {
                totalWeight: addOrsub
            };
            return additionalData;
        }

        const inProduct = {
            ...data,
            ...Input(total)
        };
        const outProduct = {
            ...data,
            ...Input(totalSubWeight)
        };
        if (data.input === 'add') {
            const product = new Product(inProduct);
            await product.save();
        } else {
            const product = new Product(outProduct);
            await product.save();
        }
    } else {
        const newWeight = data.weight;
        const additionalData = {
            totalWeight: newWeight
        };
        const productData = {
            ...data,
            ...additionalData
        };
        const product = new Product(productData);
        await product.save();
    }

    res.redirect(`/${id}/products`);
});

// Show product details
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const author = product.author;
    const products = await Product.find({ author }).populate('author');
    const farmBed = await FarmBed.find(author);
    res.render('products/pDetails', { product, farmBed, products });
});

// Update product form
router.get('/products/:id/update', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/pUpdate', { product });
});

// Update product
router.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { name, weight: newTotal, input } = data;

    const findOld = await Product.findById(id);
    const oldWeight = Number(findOld.weight);
    const newWeight = Number(data.weight);
    const oldInput = findOld.input;
    const newInput = data.input;
    const oldTotal = Number(findOld.totalWeight);
    const oldDate = findOld.createdAt;

    function Input(oldInput, newInput, oldWeight, newWeight, oldTotal) {
        if (oldInput === 'add') {
            let prevTotal = oldTotal - oldWeight;
            if (newInput === 'add') {
                const newTotal = prevTotal + newWeight;
                const additionalData = {
                    totalWeight: newTotal
                };
                TotalWeightUpdate(newTotal, oldTotal);
                return additionalData;
            } else {
                const newTotal = prevTotal - newWeight;
                const additionalData = {
                    totalWeight: newTotal
                };
                TotalWeightUpdate(newTotal, oldTotal);
                return additionalData;
            }
        } else if (oldInput === 'subtract') {
            let prevTotal = oldTotal + oldWeight;
            if (newInput === 'subtract') {
                const newTotal = prevTotal - newWeight;
                const additionalData = {
                    totalWeight: newTotal
                };
                TotalWeightUpdate(newTotal, oldTotal);
                return additionalData;
            } else {
                const newTotal = prevTotal + newWeight;
                const additionalData = {
                    totalWeight: newTotal
                };
                TotalWeightUpdate(newTotal, oldTotal);
                return additionalData;
            }
        }
    }

    const merged = {
        ...data,
        ...Input(oldInput, newInput, oldWeight, newWeight, oldTotal)
    };

    const updateProduct = await Product.findByIdAndUpdate(id, merged, { runValidators: true, new: true });

    async function TotalWeightUpdate(newTotal, oldTotal) {
        function past(newTotal, oldTotal) {
            const changeBy = newTotal - oldTotal;
            return changeBy;
        }
        const updateResult = await Product.updateMany(
            {
                name: findOld.name,
                createdAt: { $gte: oldDate },
                _id: { $ne: id }
            },
            { $inc: { totalWeight: past(newTotal, oldTotal) } }
        );
    }

    res.redirect(`/products/${id}`);
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const findProduct = await Product.findById(id);
    if (!findProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const pLink = findProduct.author;
    const farmBed = await FarmBed.findById(pLink);
    if (!farmBed) {
        return res.status(404).json({ message: 'FarmBed not found' });
    }

    const oldWeight = Number(findProduct.weight);
    const oldInput = findProduct.input;
    const oldTotal = Number(findProduct.totalWeight);
    const oldDate = findProduct.createdAt;

    function calculateNewTotalWeight(oldInput, oldWeight, oldTotal) {
        if (oldInput === 'add') {
            return oldTotal - oldWeight;
        } else if (oldInput === 'subtract') {
            return oldTotal + oldWeight;
        }
    }

    const newTotal = calculateNewTotalWeight(oldInput, oldWeight, oldTotal);

    async function updateFutureProducts(newTotal, oldTotal) {
        const changeBy = newTotal - oldTotal;
        const updateResult = await Product.updateMany(
            {
                name: findProduct.name,
                createdAt: { $gte: oldDate },
                _id: { $ne: id }
            },
            { $inc: { totalWeight: changeBy } }
        );
    }

    await updateFutureProducts(newTotal, oldTotal);
    await Product.findByIdAndDelete(id);

    res.redirect(`/${farmBed._id}/products`);
});

module.exports = router;
