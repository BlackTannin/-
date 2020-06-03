const mongoose = require("mongoose"); //载入包，var声明变量，但这里是常量，只能用const，固定
/*连接配置*/
mongoose.connect('mongodb://localhost/Express',{useNewUrlParser: true,useUnifiedTopology: true})
    .then(()=>console.log('数据库连接成功'+'前台：http://localhost:2000'+"后台：http://localhost:2000/admin"))
    .catch(err=>console.log(err,'数据库连接失败'));

module.exports = mongoose;  /*暴露mongoose，需要接收,用模型去连接配置*/


/*数据库连接配置*/