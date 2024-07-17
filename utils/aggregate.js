const Product = require('../models/product');
const mongoose = require('mongoose');

async function getTotalWeights() {
    try {
      const result = await Product.aggregate([
        // { $match: { author: mongoose.Types.ObjectId(authorId) } },
        {
          $group: {
            _id: "$name",
            totalWeight: { $sum: "$weight" }
          }
        }
      ]);
      return result;
    } catch (error) {
      console.error('Error aggregating weights:', error);
    }
  }
  
  module.exports = getTotalWeights;