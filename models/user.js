var mongoose = require('../plugin/mongoose');
const userSchema =  new mongoose.Schema({
    username:String,
    userpwd:String,
    role:{
        type:Number,
        default:1
    },
    create_at:{
        type:Date,
        default:Date.now()
    },
    update_at:{
        type:Date,
        default:Date.now()
    },

    email:String,
    headpic:{
        type:String,
        default:'1.jpg'
    },
    ip:{
        type:String,
        default:'::1'
    }
});

var User = mongoose.model("User",userSchema);

module.exports = User;
