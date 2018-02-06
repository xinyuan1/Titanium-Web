var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var  db = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['clinfo']);
var db2 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['effectiverate']);
var db3 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['mcc']);


//respond the home page: 'index.ejs'
router.get('/index', function(req, res, next) {
        res.render('index',
            { title: ' '
          });
});



router.get('/users', function(req, res, next) {
    res.send('respond with a resource');
});



router.get('/success', function(req, res, next) {
    res.send("Opps, you didn't input your information yet");
});


router.get('/mcc', function(req, res, next) {
    db3.mcc.find({},{"_id": 0}, function(err, mcc){
        res.json(mcc);
    });
    //res.send(mcc);
});


router.get('/test_data', function(req, res, next) {
    db2.effectiverate.find({},{"_id": 0}, function(err, testData){
        res.json(testData);
    });
    //res.send(mcc);
});



//Save data to database and extract data from different collection of database
//Save data to database and extract data from different collection of database
router.post('/success', function(req, res, next){
    var task = req.body;
    var mccD = req.body.Mcc;
    var mcc = parseInt(mccD)
    console.log(mcc);
    var visaMoney = req.body.a;
    var masterMoney = req.body.e;
    var discoverMoney = req.body.b;
    var amexMoney = req.body.c;
    var debitMoney = req.body.d;
    var totalFee = req.body.totalFee;
    var avgTicket = req.body.avgTicket;
    // var volume = (Number(visaMoney) + Number(masterMoney) + Number(discoverMoney) +
    //   Number(amexMoney) + Number(debitMoney));
    var volume = req.body.totalVolume;
    var effectiveRate = Number(totalFee)/Number(volume);
    var effectiveRate1 = (effectiveRate*100).toFixed(2)+"%";

    //save all data into database
    db.clinfo.save(task, function (err, task) {

    });

    //extract effectiverate from the other database
    db2.effectiverate.find({MCC: Number(mcc)}, function(err, effectiverate2){

        var num = 0;
        var sum=0;

        effectiverate2.forEach(function(values) {

            //console.log(parseFloat(values['Effective rates']));
            num= num + parseFloat(values['Effective rates']);
            sum = sum+1;
        });

        var averageER = (num/sum).toFixed(2)+"%";
        console.log(averageER);
        var different = (Number(totalFee)-Number((volume)*(num/(sum*100)))).toFixed(2);
        console.log(different);
        var yearSaving = (Number(different)*12).toFixed(2);
        console.log(yearSaving);

        //render all data to success web page
        res.render('success', {
            data: task,
            title: 'you submitted your information successfully',
            effectiveRate: effectiveRate1,
            totalVolume: volume,
            avgTicket: avgTicket,
            totalFee: totalFee,
            // values: JSON.stringify(buinfo)
            // values: effectiverate2
            values: averageER,
            monthlySaving: different,
            yearlySaving: yearSaving
        });
    });
});





//后台抽取信息到info页面
// router.get('/info', function(req, res, next ){
//
//     db1.buinfo.find( {Month: "Jan"  },{ "_id": 0, "Month": 1, "VisaCard": 1}, function(err, buinfo){
//
//        if(err||!buinfo) console.log("No information found");
//        else buinfo.forEach(function(month) {
//
//            console.log(month);
//
//             // res.send(month);
//             // res.render('info');
//        });
//         res.render('info');
//     });
// });



//数据计算方式
// router.get('/info', function(req, res, next ){
//
//     db1.buinfo.find( {Month: "Jan"  },{ "_id": 0, "Month": 1, "VisaCard": 1}, function(err, buinfo){
//
//         if(err||!buinfo) console.log("No information found");
//         else buinfo.forEach(function(month) {
//
//             console.log(month);
//
//             // res.send(month);
//             // res.render('info');
//         });
//         res.render('info');
//     });
// });


//后背数据
// router.post('/index', function(req, res, next){
//     var task = req.body;
//     var visaMoney = req.body.visaMoney;
//     var masterMoney = req.body.masterMoney;
//     var discoverMoney = req.body.discoverMoney;
//     var amexMoney = req.body.amexMoney;
//     var debitMoney = req.body.debitMoney;
//     var totalFee = req.body.totalFee;
//     var avgTicket = req.body.avgTicket;
//     var volume = (Number(visaMoney) + Number(masterMoney) + Number(discoverMoney) +
//         Number(amexMoney) + Number(debitMoney));
//     var effectiveRate = (Number(visaMoney) + Number(masterMoney) + Number(discoverMoney) +
//         Number(amexMoney) + Number(debitMoney))/11;
//
//     console.log("volume is: "+volume);
//     console.log("The fee is: "+totalFee);
//     console.log("The effectiveRate is :"+effectiveRate);
//     console.log("Average ticket is: "+avgTicket);
//     // console.log(name);
//
//     //res.render('success');
//     //  if(!task.fullName||!(task.email)){
//     //      res.status(400);
//     //      res.json({
//     //          "error": "Bad Data"
//     //      });
//     //  }
//     // else {
//     db.clinfo.save(task, function (err, task) {
//         //  if (err) {
//         //     res.send(err)
//         //  }
//         // res.json(task);
//         //res.render('/success',  {data: task} );
//         res.render('success', {
//             data: task,
//             title: 'you submit your information successfully',
//             effectiveRate: effectiveRate,
//             totalVolume: volume,
//             avgTicket: avgTicket,
//             totalFee: totalFee
//         });
//
//         // res.redirect('/success');
//     });
//     // }
// });




 // router.get('/test/:id', function(req, res, next){
 //     res.render('test', {output: req.params.id});
 //
 // });

//获取全部信息发送到index-success网页
// router.get('/success', function(req, res, next ){
//     db.clinfo.find( function(err, DB){
//         //res.redirect('/success');
//         if(err){
//               res.send(err)
//            }
//         res.send(DB);
//         res.render('/success');
//     });
// });



//获取全部信息发送到index-success网页
// router.get('/', function(req, res, next ){
//     db.clinfo.find(function(err, DB){
//        res.render('index-success', {data: DB})
//          if(err){
//              res.send(err)
//           }
//        res.json(DB);
//     });
// });



//调取确定的一条记录
// router.get('/index/id', function(req, res, next ){
//     db.clinfo.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, task){
//         if(err){
//             res.send(err)
//         }
//         res.json(task);
//     });
// });



module.exports = router;
