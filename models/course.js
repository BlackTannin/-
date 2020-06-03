var mongoose = require('../plugin/mongoose');

const courseSchema =  new mongoose.Schema({
    name:String,
    contents:String,
    thumbnail:{
        type:String,
        default:'1.jpg'
    },
    source:{
        type:String,
        default:'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7cdabcaa763392c86b944eaf4e68d6a3.mp4'
    },
    praise:{    //赞
        type:Number,
        default:0
    },
    collect:{   //收藏
        type:Number,
        default:0
    },
    browse:{     //浏览
        type:Number,
        default:0
    },
    price:{     //价格
        type:Number,
        default:0.00
    },

    create_at:{
        type:Date,
        default:Date.now()
    },
    update_at:{
        type:Date,
        default:Date.now()
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

var Course = mongoose.model("Course",courseSchema);

module.exports = Course;
