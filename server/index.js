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
const {transformBedData} = require('../utils/dataTrans');


app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'..','client', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data


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


// const insertProduce = FarmBed.insertMany([
//     {
//       bed: {
//         name: 'Bed1',
//         size: {
//           x: 200,
//           y: 150
//         },
//         pos: {
//           hor: 10,
//           ver: 5
//         }
//       },
//       item: {
//         name: 'Apple1',
//         weight: 100,
//         totalWeight: 100
//       }
//     },
//     {
//       bed: {
//         name: 'Bed2',
//         size: {
//           x: 250,
//           y: 160
//         },
//         pos: {
//           hor: 15,
//           ver: 10
//         }
//       },
//       item: {
//         name: 'Apple2',
//         weight: 150,
//         totalWeight: 150
//       }
//     },
//     {
//       bed: {
//         name: 'Bed3',
//         size: {
//           x: 180,
//           y: 140
//         },
//         pos: {
//           hor: 12,
//           ver: 8
//         }
//       },
//       item: {
//         name: 'Apple3',
//         weight: 200,
//         totalWeight: 200
//       }
//     },
//     {
//       bed: {
//         name: 'Bed4',
//         size: {
//           x: 220,
//           y: 170
//         },
//         pos: {
//           hor: 20,
//           ver: 15
//         }
//       },
//       item: {
//         name: 'Apple4',
//         weight: 250,
//         totalWeight: 250
//       }
//     },
//     {
//       bed: {
//         name: 'Bed5',
//         size: {
//           x: 210,
//           y: 160
//         },
//         pos: {
//           hor: 18,
//           ver: 12
//         }
//       },
//       item: {
//         name: 'Apple5',
//         weight: 300,
//         totalWeight: 300
//       }
//     },
//     {
//       bed: {
//         name: 'Bed6',
//         size: {
//           x: 230,
//           y: 180
//         },
//         pos: {
//           hor: 25,
//           ver: 20
//         }
//       },
//       item: {
//         name: 'Apple6',
//         weight: 350,
//         totalWeight: 350
//       }
//     }
//   ])

// .then(() => {
//     // console.log(data)
//     console.log("you have yourself some date")
    
// }) 
// .catch((err) => {
//     console.log(err)
//     console.log("error big dawg")
// }) 

app.get('/beds',  async (req,res) => {
const farmBed = await FarmBed.find({})
console.log(farmBed)
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
const products = await Product.find({author:id})
console.log(farmBed);
console.log(farmBed);

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
console.log(products)

    res.render('products/pHome',{products, farmBed});
    });

app.get('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    const author = product.author;
    // console.log(author);
    const farmBed = await FarmBed.find(author);
    console.log(farmBed[0].bed.name);
// console.log(products)

    res.render('products/pDetails', {product, farmBed});
    });
    
app.get('/products/:id/update', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
// console.log(products)

    res.render('products/pUpdate', {product});
    });
    
app.post('/beds', async (req,res) => {
const incoming = req.body;
const { bedName, bedSizeX, bedSizeY, bedPosHor, bedPosVer } = incoming;
const incomingForm = transformBedData(incoming);
console.log(bedName);
//   const name = incoming['bed.name'];

  try {
    const existingBed = await FarmBed.findOne({ 'bed.name': bedName });
    
    if (!existingBed) {
      const createBed = new FarmBed(incomingForm);
      await createBed.save();
      console.log('Bed created:', bedName);
      
    } else {
      console.log('Bed with this name already exists:', bedName);
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
    const incoming = req.body;

    // const incomingForm = transformBedData(incoming);
    console.log(incoming)

    // console.log(itemName,itemWeight,author)
    
    const product = new Product(incoming)
    await product.save();
    res.redirect(`/${id}/products`);
    });


app.post('/beds/:id', async (req,res) => {
const {id} = req.params
const incoming = req.body

console.log(id)
const farmBed = await FarmBed.findById(id)
const createProduct = await Product.insertMany([incoming]);

// console.log(incoming)
res.redirect(`/beds/${farmBed._id}`);
})

app.get('/:id/product/create', async (req,res) => {
const {id} = req.params;
const farmBed = await FarmBed.findById(id)

console.log(farmBed)
const pCreateForm = req.body
res.render('products/pCreate',{farmBed});
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
const incoming = req.body
const createProduct = await Product.findByIdAndUpdate(id,incoming, {runValidators: true, new:true});
console.log(createProduct)
res.redirect(`/products/${createProduct._id}`);
})
app.delete('/beds/:id', async (req, res) => {
    const { id } = req.params;
    const deletedBed = await FarmBed.findByIdAndDelete(id);
    res.redirect('/beds');
})
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const findProduct = await Product.findById(id);
    const pLink = findProduct.author
    console.log(pLink)
    const farmBed = await FarmBed.find(pLink);
    console.log(farmBed);
    const deletedProduct = await Product.findByIdAndDelete(id);

    res.redirect(`/${farmBed[0]._id}/products`);
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(express);
});