// const farmBedRouter = require('./routes/beds');
// const productRouter = require('./routes/products');
// const areaRouter = require('./routes/areas');


const express = require('express');
const app = express();
const ejs = require('ejs');
const port = process.env.PORT || 5000 ;
const path = require('path');
const bodyParser = require('body-parser'); // Middleware to parse request body
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// const { type } = require('os');

const FarmBed = require('../models/farmBed');
const Product = require('../models/product');
const Area = require('../models/area');

const NestObject = require('../utils/dataTrans');
const getTotalWeights  = require('../utils/aggregate'); // Import the aggregation function
const { find } = require('lodash');



app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'..','client', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


mongoose.connect('mongodb://localhost:27017/fff')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


    
// const insertProduce = new FarmBed({bed:{name: 'trevor'}})
// insertProduce.save()
// .then(() => {
//     // console.log(data)
//     console.log("you have yourself some date")
    
// }) 
// .catch((err) => {
//     console.log(err)
//     console.log("error big dawg")
// }) 




app.get('/area',  async (req,res) => {
const findAreas = await Area.find({});
// console.log(JSON.stringify(findAreas, null, 2));
const allAreas = JSON.stringify(findAreas, null, 2);

// console.log(findAreas);
res.render('area/aHome', {findAreas});
});
app.get('/area/create',  async (req,res) => {

res.render('area/aCreate');
});
app.post('/area', async (req, res) => {
    try {
        const { name, xAxis, yAxis, backgroundImageUrl, colorPoints, updatedBoxes } = req.body;

        // Parse the JSON strings back into objects
        const parsedColorPoints = JSON.parse(colorPoints);
        const parsedUpdatedBoxes = JSON.parse(updatedBoxes);

        // Create the area data
        const areaData = {
            name,
            mainSize: { x: parseInt(xAxis), y: parseInt(yAxis) },
            backgroundImage: backgroundImageUrl,
            colorPoints: parsedColorPoints,  // Correctly parsed object
            updatedBoxes: parsedUpdatedBoxes // Correctly parsed object
        };

        // Log the complete areaData object with expanded arrays and objects
        // console.log(JSON.stringify(areaData, null, 2));

        // Create a new Area instance with the areaData object
        const newArea = new Area(areaData);

        // Save the new area to the database
        await newArea.save();

        res.redirect('/area');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating area', error });
    }
});



app.get('/area/:id',  async (req,res) => {

res.render('area/aDetails');
});
app.get('/area/:id/update',  async (req,res) => {

res.render('area/aCreate');
});
app.get('/:id/beds',  async (req,res) => {//beds associated with the area

res.render('area/aCreate');
});


app.get('/beds',  async (req,res) => {
const farmBed = await FarmBed.find({})
// console.log(farmBed)
res.render('beds/home', {farmBed});
});

app.get('/beds/create', async (req,res) => {
// const {id} = req.params;
    // const product = await FarmBed.findById(id)
    // console.log(product);
    res.render('beds/bCreate');

    });

app.get('/beds/:id', async (req,res) => {
const {id} = req.params;
const farmBed = await FarmBed.findById(id)
// const products = await Product.find({name:{$eq:"pink Watermelon"},author:id})
// const products = await Product.find({author:id})
    // Aggregation pipeline to get the most recent product for each name
    const products = await Product.aggregate([
        { $match: { author: farmBed._id } }, // Match products related to the bed
        { $sort: { createdAt: -1 } }, // Sort products by creation date (most recent first)
        {
            $group: {
                _id: "$name", // Group by product name
                doc: { $first: "$$ROOT" } // Take the first document in each group (most recent)
            }
        },
        { $replaceRoot: { newRoot: "$doc" } } // Replace root with the most recent document
    ]);
console.log(products);
// console.log(farmBed);

// const product = new Product({item:{ name:'Black Watermelon'}, author: id});
// await product.save();

res.render('beds/bDetails', {farmBed, products});
});

app.get('/beds/:id/update', async (req,res) => {
const {id} = req.params;
const farmBed = await FarmBed.findById(id)

// console.log(product);
res.render('beds/bUpdate', {farmBed});
});

app.get('/:id/products', async (req,res) => {

    const {id} = req.params;
    const farmBed = await FarmBed.findById(id);
    const products = await Product.find({ author:id }).populate('author');
    const totals = await getTotalWeights();
    console.log(totals);
console.log(products)

    res.render('products/pHome',{products, farmBed});
    });

app.get('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    
    const author = product.author;
    const products = await Product.find({ author:author }).populate('author');

    const farmBed = await FarmBed.find(author);
    console.log(farmBed + "heeyeyyyy");

    // console.log(farmBed[0].bed.name);
    // console.log(products)

    res.render('products/pDetails', {product, farmBed, products});
    });

app.get('/:id/product/create', async (req,res) => {
        const {id} = req.params;
        const farmBed = await FarmBed.findById(id)
        console.log(farmBed.author)
        
        // console.log(farmBed)
        const pCreateForm = req.body
        res.render('products/pCreate',{farmBed});
        })
        
app.get('/products/:id/update', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    // console.log(products)

    res.render('products/pUpdate', {product});
    });
    
app.post('/beds', async (req,res) => {
const data = NestObject(req.body);
// const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
const {bed, name, size, x , y, pos, hor, ver, colorCode} = data;
// console.log(data.bed.name);
// console.log(data.bed.imageUrl);
// console.log(data.bed.colorCode);

// const { bedName, bedSizeX, bedSizeY, bedPosHor, bedPosVer } = incoming;

// const incomingForm = transformBedData(incoming);
// console.log(bedName);
// //   const name = incoming['bed.name'];

  try {
    const existingBed = await FarmBed.findOne({ 'bed.name': name });
    
    if (!existingBed) {
      const createBed = new FarmBed(data);
      await createBed.save();
      console.log('Bed created:', data.bed.name);
      
    } else {
      console.log('Bed with this name already exists:', data.bed.name);
      // Optionally, you can send a response indicating the duplicate
      return res.status(400).json({ message: 'Bed name must be unique' });
    }
    
  res.redirect('/beds');
  } catch (error) {
    console.error('Error creating bed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

})
app.post('/:id/products', async (req,res) => {
    const {id} = req.params;
    const data = req.body;
    const {name,weight,input} = data;
// console.log(data)
    // const incomingForm = transformBedData(incoming);
    // console.log(incoming.input)
    // console.log(itemName,itemWeight,author)
    // if(incoming.input === 'add'){
    //     console.log('added ')
    // }else{
    //     console.log('substract')
    // }

    let findProduct = await Product.findOne({ name: data.name }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // const findProduct = await Product.findOne({name: data.name})

    if(findProduct){

        const oldTotal = findProduct.totalWeight
        const newWeight = data.weight
        const total = Number(oldTotal) + Number(newWeight);
        const totalSubWeight = Number(oldTotal) - Number(newWeight);
    
        console.log("found" +  total)
        // 
        
        
        
        
        // Additional data to be merged function
        function Input(addOrsub){
            const additionalData = {
            totalWeight: addOrsub // Initialize totalWeight to the value of weight
                };
                return additionalData;
        }
        // Input(total);
        const inProduct = {
            ...data,
            ...Input(total)
        };
        const outProduct = {
            ...data,
            ...Input(totalSubWeight)
        };
        if(data.input === 'add'){
            console.log('product add');
            const product = new Product(inProduct)
            await product.save()
        }else{
            console.log('product subtracted');
            const product = new Product(outProduct)
            await product.save()
        }

        // console.log("hwllloooo" + product)

        // console.log("old" + oldTotal)
        // console.log("new" + newWeight)
        // // await product.save()
        // // findProduct.totalWeight += Number(weight); // Update total weight
        // // findProduct.weight = Number(weight); // Update current weight
        // // await findProduct.save();
    }else{
        
        const newWeight = data.weight
        // Additional data to be merged
        const additionalData = {
        totalWeight: newWeight, // Initialize totalWeight to the value of weight
        };
        const productData = {
            ...data,
            ...additionalData

        };
        const product = new Product(productData)
        await product.save();
        // console.log("not found" +  total)

    }
    
    // const product = new Product(data)


    // await product.save();
    res.redirect(`/${id}/products`);
    });


app.post('/beds/:id', async (req,res) => {
const {id} = req.params
const incoming = req.body

console.log(id)
const farmBed = await FarmBed.findById(id)
const createProduct = await new Product (incoming);

// console.log(incoming)
res.redirect(`/beds/${farmBed._id}`);
})


app.put('/beds/:id', async (req,res) => {
const {id} = req.params
const incoming = req.body
const createBed = await FarmBed.findByIdAndUpdate(id,incoming, {runValidators: true, new:true});
console.log(createBed)
res.redirect(`/beds/${createBed._id}`);
})
app.put('/products/:id', async (req,res) => {
const {id} = req.params
const data = req.body
const {name,weight: newTotal,input} = data;

const findOld = await Product.findById(id)
const oldWeight = Number(findOld.weight)
const newWeight  = Number(data.weight)
const oldInput = findOld.input
const newInput =  data.input
const oldTotal = Number(findOld.totalWeight)
let prevTotal = oldTotal - oldWeight;
const oldDate = findOld.createdAt
console.log("heheh" + findOld.createdAt)
// Additional data to be merged function
function Input(oldInput,newInput,oldWeight,newWeight,oldTotal){
    if(oldInput === 'add'){
        console.log(newInput);

        let prevTotal = oldTotal - oldWeight;
        if(newInput === 'add'){
        console.log("heyyyy add");
        const newTotal = prevTotal + newWeight
            const additionalData = {
                totalWeight: newTotal  // Initialize totalWeight to the value of weight
                };
                TotalWeightUpdate(newTotal, oldTotal)
                return additionalData; 
        }else{
        const newTotal = prevTotal - newWeight

            const additionalData = {
                totalWeight: newTotal  // Initialize totalWeight to the value of weight
                };  
                TotalWeightUpdate(newTotal, oldTotal)
                return additionalData; 
        }
    }
    else if(oldInput === 'subtract'){

        let prevTotal = oldTotal + oldWeight;
        const newTotal = prevTotal - newWeight
        if(newInput === 'subtract'){
            const additionalData = {
                totalWeight: newTotal  // Initialize totalWeight to the value of weight
                };  
                TotalWeightUpdate(newTotal, oldTotal)
                return additionalData; 
        }else{
            const newTotal = prevTotal + newWeight
            const additionalData = {
                totalWeight: newTotal // Initialize totalWeight to the value of weight
                };  
                TotalWeightUpdate(newTotal, oldTotal)
                return additionalData; 
        }
    }

}
// Input(oldInput,newInput,oldWeight,newWeight,oldTotal);


// Input(oldInput,newInput,oldWeight,newWeight,oldTotal);
const merged = {
    ...data,
    ...Input(oldInput,newInput,oldWeight,newWeight,oldTotal)
};

const updateProduct = await Product.findByIdAndUpdate(id,merged, {runValidators: true, new:true});
      // Update all products with the specified name and created after the comparison date,
    // but exclude the product with the specified _id
    async function TotalWeightUpdate(newTotal, oldTotal){
        function past(newTotal,oldTotal){
            if(oldTotal >=  newTotal ){ // you subtracted from the total
                const changeBy = newTotal - oldTotal;
                console.log(changeBy + "prev>=")
                return changeBy;
            }else{
                const changeBy = newTotal - oldTotal;
                console.log(changeBy + "prev")

                return changeBy;
            }
        }
        const updateResult = await Product.updateMany(
            { 
              name: findOld.name,
              createdAt: { $gte: oldDate },
              _id: { $ne: id } // Exclude the product with this _id
            },
            { $inc: { totalWeight: past(newTotal,oldTotal), runValidators: true, new:true  } }
          );
          console.log(updateResult)
    }

res.redirect(`/products/${id}`);
})
app.delete('/beds/:id', async (req, res) => {
    const { id } = req.params;
    const deletedBed = await FarmBed.findByIdAndDelete(id);
    res.redirect('/beds');
})
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;

    // Find the product to be deleted
    const findProduct = await Product.findById(id);
    if (!findProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const pLink = findProduct.author;
    console.log(pLink);
    const farmBed = await FarmBed.findById(pLink);
    if (!farmBed) {
        return res.status(404).json({ message: 'FarmBed not found' });
    }

    const oldWeight = Number(findProduct.weight);
    const oldInput = findProduct.input;
    const oldTotal = Number(findProduct.totalWeight);
    const oldDate = findProduct.createdAt;

    // Function to calculate the new total weight
    function calculateNewTotalWeight(oldInput, oldWeight, oldTotal) {
        if (oldInput === 'add') {
            return oldTotal - oldWeight;
        } else if (oldInput === 'subtract') {
            return oldTotal + oldWeight;
        }
    }

    const newTotal = calculateNewTotalWeight(oldInput, oldWeight, oldTotal);

    // Function to update the total weight of all future products with the same name
    async function updateFutureProducts(newTotal, oldTotal) {
        const changeBy = newTotal - oldTotal;
        const updateResult = await Product.updateMany(
            {
                name: findProduct.name,
                createdAt: { $gte: oldDate },
                _id: { $ne: id } // Exclude the product to be deleted
            },
            { $inc: { totalWeight: changeBy } }
        );
        console.log(updateResult);
    }

    // Update future products
    await updateFutureProducts(newTotal, oldTotal);

    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.redirect(`/${farmBed._id}/products`);
});


// app.use('/areas', areaRouter);
// app.use('/beds', farmBedRouter);
// app.use('/products', productRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(express);
});