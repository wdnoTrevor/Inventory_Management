
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

            },
            imageUrl: {
                type: String, // URL to the image
                required: false
              },
            colorCode: {
                type: String, // Color code
                required: false
              }
        ,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmBed', required: true },
        


    }, { timestamps: true } // This option adds createdAt and updatedAt fields

)

const product = new mongoose.model('Product', ProductSchema);
module.exports = product;