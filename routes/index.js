var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var  db = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['clinfo']);
var db2 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['effectiverate']);
var db3 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['mcc']);
var db4 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['count']);

//respond the home page: 'index.ejs'
router.get('/index', function(req, res, next) {
        res.render('index',
            { title: ' '
          });
});

//respond the home page: 'success.ejs'
router.get('/success', function(req, res, next) {
    res.send("Opps, you didn't input your information yet");
});

//respond the home page: 'mcc.ejs'
router.get('/mcc', function(req, res, next) {
    db3.mcc.find({},{"_id": 0}, function(err, mcc){
        res.json(mcc);
    });
    //res.send(mcc);
});



//Save data to database and extract data from different collection of database
router.post('/success', function(req, res, next){
    var task = req.body;
    var mccD = req.body.Mcc;
    var mcc = parseInt(mccD)
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

    //insert effective rate into document of clinfo collection what we just created
    db.clinfo.update({"email": task.email}, {"$set":{"effectiverate":effectiveRate1}});

    //extract effectiverate from the other database
    db2.effectiverate.find({MCC: Number(mcc)}, function(err, effectiverate2){

        var num = 0;
        var sum=0;

        //loop to add all effectiverate and the number of items
        effectiverate2.forEach(function(values) {
            //console.log(parseFloat(values['Effectiverates']));
            num= num + parseFloat(values['Effectiverates']);
            sum = sum+1;
          });

        var averageER = (num/sum).toFixed(2)+"%";
        console.log(averageER);
        var different = (Number(totalFee)-Number((volume)*(num/(sum*100)))).toFixed(2);
        console.log(different);
        var yearSaving = (Number(different)*12).toFixed(2);
        console.log(yearSaving);

        //MapReduce and create count collection
        db2.effectiverate.mapReduce(
            function() { emit(this.Effectiverates,1); },
            function(key, values) {return Array.sum(values)},
            {
                query:{MCC:Number(mcc)},
                out:{replace:"count"}
            }
        )

        //extract data from collection 'count' that just made in MapReduce
        db4.count.find( function(err, count){

              console.log(count);
        //render all data to success web page
        res.render('success', {
            data: task,
            title: 'you submitted your information successfully',
            mccD: mccD,
            effectiveRate: effectiveRate1,
            totalVolume: volume,
            avgTicket: avgTicket,
            totalFee: totalFee,
           // values: JSON.stringify(buinfo)
           // values: effectiverate2
            values: averageER,
            monthlySaving: different,
            yearlySaving: yearSaving,
            count1: JSON.stringify(count)
            //count1: count
        });
       });
    });
});



module.exports = router;
