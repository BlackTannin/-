var express = require('express');
var router = express.Router();

var User = require('../models/user');         /*引入用户模型*/
var Category = require('../models/category'); /*引入分类模型*/
var Course = require('../models/course');     /*引入课程模型*/
var Order = require('../models/order');       /*引入订单模型*/

var moment = require('moment');   /*时间处理包*/


router.get('/', function(req, res, next) {
  User.find().then(result=>{
    result.forEach(function (v,i) {
      v.indexcr = moment(v.create_at).format('YYYY-MM-DD');  /*html遍历，create*/
      v.indexup = moment(v.update_at).format('YYYY-MM-DD');  /*html遍历，create*/
    })
    console.log(result);
    res.render('index', { title: 'Express' ,data:result});
  })
});

/*category获取分类*/
router.get("/category",function (req,res,next) {
  Category.find().then(result=>{
    res.json({result});
  })
})

/*—————————————————————————————这里是给前台的ajax去使用—————api—————获取课程（分类子级子级）—————————————————————————————————————————————*/
/*获取课程ID  category:id*/
router.get("/category/:id",function (req,res,next) {
  var categoryid = req.params.id;
  Course.find({category:categoryid}).populate("category").populate("user").then(result=>{
    result.forEach(function (v,i) {
      v.qt_kc = moment(v.create_at).format('YYYY年MM月DD')
    })
    res.render("categorylist",{data:result})
  })
})
/*—————————————————————————————以上是给前台的ajax去使用—————api—————获取课程（分类子级子级）—————————————————————————————————————————————*/

/*课程详情*/
router.get("/show/:id",async function(req,res){
  var course,tuijian;
  await Course.findOne({_id:req.params.id}).populate("category").populate("user").then(result=>{
    result.qt_xq = moment(result.crate_at).format('YYYY年MM月DD ');
    course = result;/*通过id查找到的课程数据*/
  })
  await Course.find().limit(5).then(result=>{
    tuijian = result;/*查找到的推荐课程数据*/
  })
  res.render("show",{course:course,top5:tuijian});
})


/*json数据，axios*/
router.get("/courses",function (req,res,next) {
  Course.find().populate("category").populate("user").then(result=>{
    result.forEach(function(v,i){
      result[i].crate_at = moment(v.crate_at).format('YYYY年MM月DD');
    })
    res.json(result)
  })
})




module.exports = router;
