const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for storing color points
const colorPointsSchema = new Schema({
    color: { type: String, required: true },
    points: [{ type: String, required: true }] // Array of strings in the format "x,y"
});

// Schema for storing updated boxes
const updatedBoxSchema = new Schema({
    originalPos: { 
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    newSize: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    innerGridPoints: [{ type: String, required: true }] // Array of strings representing the inner grid points
});

// Main area schema
const areaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mainSize: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    backgroundImage: { type: String }, // URL of the background image
    colorPoints: { type: [colorPointsSchema], default: [] }, // Array of color points objects
    updatedBoxes: { type: [updatedBoxSchema], default: [] } // Array of updated boxes objects
});

const Area = mongoose.model('Area', areaSchema);
module.exports = Area;













































// // const { yellow } = require('color-name');
// const mongoose = require('mongoose');
// const { type } = require('os');
// // const { type } = require('os');

// // Schema for storing color points
// const colorPointsSchema = new Schema({
//     color: { type: String },
//     points: [{ type: String }] // Array of strings in the format "x,y"
//   });

// // Schema for storing color points
// const UpdateBoxSchema = new Schema({
//     updatedBox: { 
//         x:{
//             type:Number
//         },
//         y:{
//             type:Number
//         }
//     },
//     updatedSubBox: {
//         x:{
//             type:Number
//         },
//         y:{
//             type:Number
//         }
//         }
//   });

// const areaSchema = new mongoose.Schema (
//     {
//         name:{
//             type: String,
//         },
//         mainSize:{
//             x:{
//                 type: Number
//             },
//             y:{
//                 type: Number
//             }
//         },
//         colorPoints:{ type: [colorPointsSchema] , default: [] }, // Array of color points objects // Array of color points objects
//         updatedBoxes: {type:[UpdateBoxSchema], default: []  }
//         // updateSize:{
//         //     pos:{
//         //         x:Number,
//         //         y:Number
//         //     },
//         //     x:{
//         //         type:Number
//         //     },
//         //     y:{
//         //         type:Number
//         //     }
//         // },


//     }

// )

// const Area = new mongoose.model('Area', areaSchema);
// module.exports = Area;

