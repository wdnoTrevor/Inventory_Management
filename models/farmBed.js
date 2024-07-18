// const { yellow } = require('color-name');
const mongoose = require('mongoose');
const { type } = require('os');
// const { type } = require('os');


const farmBedSchema = new mongoose.Schema (
    {
        bed: {

            name: {
                type: String,
                
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
            },
            description:{
                type: String
            },
            imageUrl: {
                type: String, // URL to the image
                required: false
              },
            colorCode: {
                type: String, // Color code
                required: false
              }
        }
    }

)

const FarmBed = new mongoose.model('FarmBed', farmBedSchema);
module.exports = FarmBed;