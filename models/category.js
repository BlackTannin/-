var mongoose = require('../plugin/mongoose');

const categorySchema =  new mongoose.Schema({
    name:String,
    orderno:Number
});

var Category = mongoose.model("Category",categorySchema);

module.exports = Category;
