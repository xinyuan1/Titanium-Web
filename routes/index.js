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

//respond the home page: 'count.ejs'
router.get('/count', function(req, res, next) {

    var arr1 = new Array();
    db4.count.find({},{}, function(err, count){
        count.forEach(function(values) {
           var count = values['value'];
           var effective_rate = parseFloat(values['_id']);
           var type = values['type'];
           console.log( );

           arr1.push(values);

        });
        res.send(arr1);
        console.log(arr1);
    });

    // // db4.count.update({ }, {$rename: {"value":"count"}}, {multi:true});
    // db4.count.find({},{},{$rename: {"value":"count"}}, function(err, count){
    //     res.json(count);
    //
    //     });

});


//Save data to database and extract data from different collection of database
router.post('/success', function(req, res, next){
    var task = req.body;
    var mccD = req.body.Mcc;
    var mcc = parseInt(mccD)
    var totalFee = req.body.totalFee;
    var avgTicket = req.body.avgTicket;
    var volume = req.body.totalVolume;
    var effectiveRate = Number(totalFee)/Number(volume);
    // old effective rate
    var effectiveRate1 = (effectiveRate*100).toFixed(2)+"%";

    //save all clients' data into database
    db.clinfo.save(task, function (err, task) {
    });


    //extract other effectiverate from database
    db2.effectiverate.find({MCC: Number(mcc)}, function(err, effectiverate2){

        var num = 0;
        var sum=0;
        var arr = new Array();

        //loop to add all effectiverate and the number of items
        effectiverate2.forEach(function(values) {
            //console.log(parseFloat(values['Effectiverates']));
            arr.push(parseFloat(values['Effectiverates']));
            num= num + parseFloat(values['Effectiverates']);
            sum = sum+1;
          });

           arr.sort();
        //console.log(arr);
        // console.log(arr.length);

        //median of efective rate
         var lowMiddle=Math.floor((arr.length-1)/2);
         var highMiddle=Math.ceil((arr.length-1)/2);
         var median = (arr[lowMiddle]+arr[highMiddle])/2+"%";

        console.log(median);

         //average of effective rate
        var averageER = (num/sum).toFixed(2)+"%";
        //console.log("so the average effective rate is: "+averageER);
        var different = (Number(totalFee)-Number((volume)*(num/(sum*100)))).toFixed(2);
        //console.log(different);
        var yearSaving = (Number(different)*12).toFixed(2);
       // console.log(yearSaving);

        //insert effective rate into document of clinfo collection what we just created
        db.clinfo.update({"email": task.email}, {"$set":{"clientEffRate":effectiveRate1, "averageEffRate":averageER}});

        //MapReduce and create count collection
        db2.effectiverate.mapReduce(
            function() { emit(this.Effectiverates,1); },
            function(key, values) {return Array.sum(values)},
            {
                query:{MCC:Number(mcc)},
                out:{replace:"count"}
            }
        )


        //insert count 'type' data
        //db4.count.update({"_id":median}, {"$set":{"type":"median"}});
         //db4.count.update({}, {"$set":{"type":"normal"}}, {multi:true});
        // db4.count.insert({_id:averageER, count: 1, type: "new"});
        // db4.count.insert({_id:median, count: 1, type: "median"});
        // db4.count.insert({_id:effectiveRate1, count: 1, type: "old"});
        //db4.count.save({}, {"$set":{"_id":"2.55%"}});
        //db4.count.update({ }, {"$set":{"_id":averageER, "type":"old"}});
        //db4.count.update({"_id":averageER}, {"$set":{"type":"new"}});
        //change key name
       // db4.count.update({ }, {$rename: {"value":"count"}}, {multi:true});
       // db4.count.aggregate( {$project: {"count":"$value"}});


        //by if statement insert data into "count" collection
        db4.count.find({},{}, function(err, count){

            count.forEach(function(values) {
                db4.count.update({}, {"$set":{"type":"normal"}});
            });

            count.forEach(function(values) {
                if(values['_id']!=averageER)
                   db4.count.insert({_id:averageER, value: 1, type: "new"});
                else
                   db4.count.update({"_id":averageER}, {"$set":{"type":"new"}});

            });
            count.forEach(function(values) {
                if(values['_id']!=effectiveRate1)
                    db4.count.insert({_id:effectiveRate1, value: 1, type: "old"});
                else
                    db4.count.update({"_id":effectiveRate1}, {"$set":{"type":"old"}});
            });
            count.forEach(function(values) {
                if(values['_id']!=median)
                    db4.count.insert({_id:median, value: 1, type: "median"});
                else
                    db4.count.update({"_id":median}, {"$set":{"type":"median"}});
            });

        });


        //extract data from collection 'count' that just made in MapReduce
        //db4.count.find( function(err, count){

        //console.log(count);
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
            yearlySaving: yearSaving
            //count1: JSON.stringify(count)
            //count1: count
        //});
       });
    });
});

module.exports = router;
