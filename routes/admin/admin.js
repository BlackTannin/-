var express = require('express');
var router = express.Router();


var Category = require('../../models/category');    /*引入分类模型*/
var Course = require('../../models/course');        /*引入课程模型*/
var User = require('../../models/user');            /*引入用户模型*/

var moment = require('moment'); /*时间处理包*/
var multer = require('multer'); /*文件上传包*/
var path = require('path');     /*获取文件扩展名*/
/*磁盘存储位置*/          //固定
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/course')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage })


router.get('/',function (req,res,next) {
    res.render('admin/index')
})


/*————————————————————————————分类操作——————————————————————————————————*/
/*查看分类*/
router.get('/categorylist',function (req,res) {
    Category.find().sort('orderno')
        .then(result=>{
            res.render('admin/categorylist',{data:result});
        })
})
/*添加分类*/
router.get('/addcategory',function (req,res,next) {
    res.render('admin/addcategory')
})
router.post('/addcategory',function (req,res,next) {
    var name = req.body.categoryname;
    var orderno = req.body.orderno;
    Category.create({   /*添加数据，固定语句*/
        name:name,
        orderno:orderno
    }).then(result=>{
        if(result._id){
            res.redirect('/admin/categorylist')
        }else {
            res.redirect('back')
        }
    })

})
/*删除分类*/
router.get("/category/:id/delete",function (req,res,next) {
    var id = req.params.id;
    Category.findOneAndDelete({_id:id})
        .then(result=>{
            if(result._id){
                res.redirect("/admin/categorylist");
            }else{
                res.redirect("back");
            }
        })
})
/*修改分类*/
router.get("/category/:id/edit",function (req,res) {
    var id = req.params.id;
    Category.findOne({_id:id}).then(result=>{
        res.render("admin/editcategory",{data:result})
    })

})
router.post("/category/:id/edit",function (req,res) {
    var id = req.params.id;
    Category.updateOne({_id:id},{
        name:req.body.name,
        orderno:req.body.orderno
    },function (err,result) {
        console.log(err,result);
        if(!err && result){
            console.log("修改分类成功");
            res.redirect("/admin/categorylist");
        }else{
            res.redirect("back");
        }
    })
})

/*————————————课程操作————————————————————————————————————————————-*/

/*显示所有课程*/
router.get("/courses",function (req,res) {
    Course.find().populate("category").populate("user")
        .then(result=>{
            result.forEach(function (v,i) {
                v.ht_kc = moment(v.create_at).format('YYYY-MM-DD');
            })
            res.render('admin/courses',{data:result})
        })
});
/*添加课程,获取和响应*/
router.get("/addcourse",async function (req,res) {
    var category,user;
    await Category.find().sort('orderno').then(result=>{category = result;})
    await User.find().then(result=>{user = result;})
    res.render("admin/addcourse",{category:category,user:user});
})
router.post("/addcourse",upload.single('thumbnail'),async function (req,res) {
    if(req.file){
        Course.create({
            name:req.body.coursename,           /*获取名字*/
            category:req.body.category,         /*获取分类*/
            thumbnail:req.file.filename,
            user:req.body.user,
            price:req.body.price,
            contents:req.body.contents,
            source:req.body.source,
            praise:req.body.praise,             /*赞*/
            collect:req.body.collect,           /*收藏*/
            browse:req.body.browse,             /*浏览*/
        }).then(result=>{
            if(result._id){
                res.redirect("/admin/courses")
            }else{
                res.redirect("back")
            }
        })
    }else{
        res.redirect("back");
    }

})
/*删除课程*/
router.get("/course/:id/delete", function(req,res){
    Course.deleteOne({_id:req.params.id},function (err) {
        if(!err){
            console.log("删除成功");
        }
        res.redirect("back");
    })
});
/*修改课程*/
router.get('/course/:id/edit',async function (req,res) {
    var id = req.params.id;
    var data,category,user;
    await Course.findOne({_id:id}).then(result=>{data = result;});
    await Category.find().sort('orderno').then(result=>{category = result;});
    await User.find().then(result=>{user = result});
    res.render('admin/editcourse',{data:data,user:user,category:category})
})
router.post("/course/:id/edit",upload.single('thumbnail'),function (req,res) {
    var id = req.params.id;
    Course.updateOne({_id:id},{
        name:req.body.coursename,           /*获取名字*/
        category:req.body.category,         /*获取分类*/
        thumbnail:req.file.filename,        /*获取图片*/
        user:req.body.user,                 /*获取用户*/
        contents:req.body.contents,         /*获取文本*/
        source:req.body.source,             /*视频地址*/
        praise:req.body.praise,             /*赞*/
        collect:req.body.collect,           /*收藏*/
        browse:req.body.browse,             /*浏览*/
        price:req.body.price,
    },function (err,result) {
        console.log(err,result);
        if(!err && result){
            console.log("修改课程成功");
            res.redirect("/admin/courses");
        }else{
            res.redirect("back");
        }
    })
})



/*————————————以上是课程操作————————————————————————————————————————————-*/


/*用户管理*/
router.get('/users',function (req,res,next) {
    User.find().then(result=>{
        result.forEach(function (v,i) {
            v.yhcreate = moment(v.create_at).format('YYYY-MM-DD');  /*html遍历，create*/
            v.yhupdate = moment(v.update_at).format('YYYY-MM-DD');  /*html遍历，create*/
        })
        res.render('admin/users',{data:result});
    })
})

/*删除用户*/
router.get("/users/:id/delete",function(req,res){

    User.deleteOne({_id:req.params.id},function (err) {
        if(!err){
            console.log("删除成功");
        }
        res.redirect("back");
    })
});

/*用户修改*/
router.get('/users/:id/edit',async function (req,res) {
    var data,name,email;
    var id = req.params.id;
    await User.findOne({_id:id}).then(result=>{data = result;})
    res.render('admin/edituser',{data:data,name:name,email:email});
})
router.post("/users/:id/edit",upload.single('headpic'),function (req,res) {
    var id = req.params.id;
    User.updateOne({_id:id},{
        username:req.body.username,
        email:req.body.email,
        headpic:req.file.filename,
        userpwd:req.body.userpwd,

    },function (err,result) {
        console.log(err,result);
        if(!err && result){
            console.log("修改用户信息成功");
            res.redirect("/admin/users");
        }else{
            console.log("修改用户信息失败");
            res.redirect("back");
        }
    })
})

/*用户添加*/
router.get("/adduser",function (req,res) {
    res.render("admin/adduser")
})
router.post("/adduser",async function (req,res) {
    console.log(req.file);
    if(req.body.userpwd != req.body.reuserpwd){
        console.log("用户密码两次输入不一致");
        res.redirect("back")
    }else{
        User.find({$or:[{username:req.body.username},{email:req.body.email}]},function (err,result) {
            if (result.length==0){
                User.create({
                    username:req.body.username,
                    userpwd:req.body.userpwd,      //md5.get(req.body.userpwd),
                    email:req.body.email
                }).then(result=>{
                    if(result._id){
                        console.log("注册成功");
                        res.redirect("/admin/users");
                    }else{
                        res.redirect("back")
                    }
                })
            }
        })
    }
})


/*vue获取路由数据axios*/
router.get('/findCourse/:id',function (req,res,next) {
    //获取分类数据
    Course.findOne({_id:req.params.id}).then(result=>{
        res.json({result});
    })

})






module.exports = router;
