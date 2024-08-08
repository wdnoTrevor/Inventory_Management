// const { yellow } = require('color-name');
const mongoose = require('mongoose');
const { type } = require('os');
// const { type } = require('os');

// Schema for storing color points
const colorPointsSchema = new Schema({
    color: { type: String },
    points: [{ type: String }] // Array of strings in the format "x,y"
  });

// Schema for storing color points
const UpdateBoxSchema = new Schema({
    updatedBox: { 
        x:{
            type:Number
        },
        y:{
            type:Number
        }
    },
    updatedSubBox: {
        x:{
            type:Number
        },
        y:{
            type:Number
        }
        }
  });

const areaSchema = new mongoose.Schema (
    {
        name:{
            type: String,
        },
        mainSize:{
            x:{
                type: Number
            },
            y:{
                type: Number
            }
        },
        colorPoints:{ type: [colorPointsSchema] , default: [] }, // Array of color points objects // Array of color points objects
        updatedBoxes: {type:[UpdateBoxSchema], default: []  }
        // updateSize:{
        //     pos:{
        //         x:Number,
        //         y:Number
        //     },
        //     x:{
        //         type:Number
        //     },
        //     y:{
        //         type:Number
        //     }
        // },


    }

)

const Area = new mongoose.model('Area', areaSchema);
module.exports = Area;

