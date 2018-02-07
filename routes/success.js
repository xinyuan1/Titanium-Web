var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['clinfo']);
var db2 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['effectiverate']);
var db3 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['mcc']);

// router.get('/', function(req, res, next) {
//
//
//     db2.effectiverate.find({MCC: 5812}, function(err, effectiverate2){
//
//         var num=0;
//         var sum=0;
//
//         effectiverate2.forEach(function(values) {
//             console.log(parseFloat(values['Effective rates']));
//
//             num= num + parseFloat(values['Effective rates']);
//             sum = sum+1;
//         });
//
//
//     res.render('success', {
//         title: ' ',
//         num: num,
//         sum: sum
//     });
//    //res.send('tianqibucuo ');
// });
// });










// router.post('/success', function(req, res, next){
//     var task = req.body;
//     var mcc = req.body.mcc;
//     var visaMoney = req.body.a;
//     var masterMoney = req.body.e;
//     var discoverMoney = req.body.b;
//     var amexMoney = req.body.c;
//     var debitMoney = req.body.d;
//     var totalFee = req.body.totalFee;
//     var avgTicket = req.body.avgTicket;
//    // var volume = (Number(visaMoney) + Number(masterMoney) + Number(discoverMoney) +
//      //   Number(amexMoney) + Number(debitMoney));
//     var volume = req.body.totalVolume;
//     var effectiveRate = Number(totalFee)/Number(volume);
//     var effectiveRate1 = (effectiveRate*100).toFixed(2)+"%";
//
//     console.log("volume is: "+volume);
//     console.log("The fee is: "+totalFee);
//     console.log("The effectiveRate is :"+effectiveRate1);
//     console.log("Average ticket is: "+avgTicket);
//
//     db.clinfo.save(task, function (err, task) {
//
//     });
//
//     db2.effectiverate.find({MCC: 5812}, function(err, effectiverate2){
//
//         var  num = 0;
//         var sum=0;
//
//         effectiverate2.forEach(function(values) {
//             console.log(parseFloat(values['Effective rates']));
//
//             num= num + parseFloat(values['Effective rates']);
//             sum = sum+1;
//         });
//         //console.log(num);
//         // console.log(sum);
//         var averageER = (num/sum).toFixed(2)+"%";
//         console.log(averageER);
//
//         var different = (Number(totalFee)-Number((volume)*(num/(sum*100)))).toFixed(2);
//         console.log(different);
//
//         var yearSaving = Number(different)*12;
//         console.log(yearSaving);
//
//         res.render('success', {
//             data: task,
//             title: 'you submitted your information successfully',
//             effectiveRate: effectiveRate1,
//             totalVolume: volume,
//             avgTicket: avgTicket,
//             totalFee: totalFee,
//             // values: <%=count1['value']%>(buinfo)
//             // values: effectiverate2
//             values: averageER,
//             monthlySaving: different,
//             yearlySaving: yearSaving
//         });
//     });
// });





module.exports = router;