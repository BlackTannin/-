var express = require('express');
var router = express.Router();

var User = require("../models/user");     /*引入用户模型*/
var Course = require("../models/course");/*引入课程模型*/
var Order = require("../models/order");   /*引入订单模型*/
/*/-----------------------------------*/
var moment = require('moment');   /*时间处理包*/
var multer = require('multer');   /*文件上传包*/
var path = require('path');       /*获取文件扩展名*/
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
/*/-----------------------------------*/



var md5 = require('../plugin/md5');/*引入md5加密配置*/



/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(md5.get('4444'));
    User.find().then(result=>{
        console.log(result);
    });
    res.send('respond with a resource');
});

/*————————————登录模块——————————————————————————*/
//登录
router.get('/login',function (req,res,next) {
    res.render('user/login')
})
router.post('/login',function (req,res) {
    User.findOne({
        username:req.body.username,
        userpwd:md5.get(req.body.userpwd)
    }).then(result=>{
        if (result){
            req.flash("type","success");
            req.flash("message","成功登录");
            req.session.user = result;
            req.session.islogin = true;
            res.redirect('/');
        }else{
            req.flash("type","warning");
            req.flash("message","用户名或密码错误，请重新登录");
            req.session.isLogin = false;
            res.redirect('back')
        }
    })

});
/*注销*/
router.get('/logout',function (req,res) {
    req.session.destroy();  //毁掉session，（取消登录状态）
    res.redirect('/')
})

/*也有人这么写，如果session有值，就毁掉它
* router.get("/logout",function (req,res) {
    if(req.session){
        req.session.destroy();
    }
    res.redirect("/")
})
*
* */
/*————————————登录模块——————————————————————————*/


/*————————————注册模块——————————————————————————*/
/*注册*/
router.get('/register',function (req,res,next) {
    res.render('user/register')
})
router.post('/register',async function (req,res,next) {
    //判断密码是否一致
    if (req.body.userpwd != req.body.reuserpwd){
        req.flash("type","warning");
        req.flash("message","密码不一致");
        res.redirect('back')
    }else {
        //判断用户名或者邮箱是否已存在
        await User.find({$or:[
                    {username:req.body.username},{email:req.body.email}
                ]},function (err,result) {
                if (result.length==0){
                    User.create({
                        username:req.body.username,
                        userpwd:md5.get(req.body.userpwd),
                        email:req.body.email
                    }).then(jieguo=>{
                        req.flash("type","success");
                        req.flash("message","注册成功，您已成功登录");
                        req.session.user = jieguo;
                        req.session.islogin = true;
                        res.redirect('/')
                    })
                }
            }


        )
    }






})
/*————————————注册模块——————————————————————————*/


/*支付*/
router.get('/pay/:id', function (req,res) {
    if(res.locals.islogin){
        Order.find({courser:req.params.id,user:req.session.user._id},function (err,result) {
            console.log(err,result);
            if(result.length){    /*长度不要大于0，不然会重复购买*/
                req.flash("type","info");
                req.flash("message","无需重复购买");
                res.redirect('back');
            }else {
                Course.findOne({_id:req.params.id},function (err,result) {
                    if (!err&&result){
                        res.render('user/pay',{data:result});
                    }else {
                        res.redirect('back')
                    }
                })
            }
        })
    }else {
        req.flash("type","warning");
        req.flash("message","尚未登录，请登录");
        res.redirect('back');
    }


});
router.post('/addorder',function (req,res) {
    Order.create({
        user:req.session.user._id,
        courser:req.body.id,
        prices:req.body.prices
    }).then(result=>{
        if(result){
            req.flash("type","success");
            req.flash("message","购买课程成功");
            res.redirect("/users/mycourse");
        }else {
            req.flash("type","warning");
            req.flash("message","购买课程失败");
            res.redirect("back")
        }
    })
});


/*我的订单（课程）*/
router.get("/mycourse",function (req,res) {
    Order.find({user:req.session.user._id}).populate("user").populate('courser')
        .then(result=>{
            res.render("user/mycourse",{data:result});
        })
});
/*删除我的订单（课程）*/
router.get("/mycourse/:id/delete", function(req,res){
    Order.deleteOne({user:req.session.user._id},function (err) {
        if(!err){
            console.log("删除成功");
        }
        res.redirect("back");
    })
});
/*个人信息修改*/
/*用户修改*/
router.get('/edit',async function (req,res) {
    var data;
    var id = req.session.user._id;
    await User.findOne({_id:id}).then(result=>{
        data = result;
    })
    res.render('user/edit',{ddd:data});
})
router.post("/:id/edit",upload.single('headpic'),function (req,res) {
    var id = req.session.user._id;
    User.updateOne({_id:id},{
        email:req.body.email,
        headpic:req.file.filename,
        userpwd:req.body.userpwd,

    },function (err,result) {
        console.log(err,result);
        if(!err && result){
            console.log("修改用户信息成功");
            res.redirect("/user/info");
        }else{
            console.log("修改用户信息失败");
            res.redirect("back");
        }
    })
})

router.get('/info', function (req,res) {

    res.render('user/info');
})

module.exports = router;
