// const { yellow } = require('color-name');
const mongoose = require('mongoose');
// const { type } = require('os');

// const fffStoreSchema = new mongoose.Schema ([
//     {
//         name: {
//             type:String
//         },
//         weight:{
//             type:Number,
//             max:[25]
//         },
//         unit:{
//             type: String,
//             enum: ['grams', 'pounds']
//         }
//     }

// ])
const farmBedSchema = new mongoose.Schema ([
    {
        bed: {

            name: {
                type: String,
                unique:true,
                
            },
            size:{
                x:{
                    type:Number,
                    
                },
                y:{
                    type:Number
                },
            },
            pos:{
                hor:{
                    type:Number
                },
                ver:{
                    type:Number
                },
            }
            
            
        }
    }

])

const FarmBed = new mongoose.model('FarmBed', farmBedSchema);
module.exports = FarmBed;