var mongoose = require('../plugin/mongoose');
const orderSchema =  new mongoose.Schema({

    price:{
        type:Number,
        default:0.00
    },
    courser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    openid:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    create_at:{
        type:Date,
        defualt:Date.now()
    },

});

var Order = mongoose.model("Order",orderSchema);

module.exports = Order;
