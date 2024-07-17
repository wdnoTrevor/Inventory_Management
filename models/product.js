
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema (
    {
      
        
            name:{
                type: String
            },
            weight:{
                type: Number,
                default: 0
            },
            input:{
                type: String,
                enum:['add', 'subtract']
            },
            totalWeight:{
                type: Number,
                default: 0

            }
        ,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmBed', required: true },
        


    }, { timestamps: true } // This option adds createdAt and updatedAt fields

)

const product = new mongoose.model('Product', ProductSchema);
module.exports = product;