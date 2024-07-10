
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema ([
    {
      
        
            name:{
                type: String
            },
            weight:{
                type: Number
            },
            totalWeight:{
                type: Number
            }
        ,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmBed', required: true }


    }

])

const product = new mongoose.model('Product', ProductSchema);
module.exports = product;