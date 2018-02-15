var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var  db = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['clinfo']);
var db2 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['effectiverate']);
var db3 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['mcc']);
var db4 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['count']);

<<<<<<< HEAD
var effectiveRateValOld = -1;
var effectiveRateValNew=-1;
var mccV = -1;
var medianV = -1;

//respond the home page: 'index.ejs';
router.get('/', function(req, res, next) {
=======
//respond the home page: 'index.ejs'
router.get('/index', function(req, res, next) {
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
        res.render('index',
            { title: ' '
          });
});

<<<<<<< HEAD

//respond the home page: 'success.ejs';
=======
//respond the home page: 'success.ejs'
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
router.get('/success', function(req, res, next) {
    res.send("Opps, you didn't input your information yet");
});

<<<<<<< HEAD

//respond the home page: 'mcc.ejs';
router.get('/mcc', function(req, res, next) {
    db2.mcc.find({},{"_id": 0}, function(err, mcc){
        res.json(mcc);
    });
});

// sort function;
var compare = function(a,b) {
    //console.log(a,b)
    a = parseFloat(a.effective_rate.substring(0, a.effective_rate.length-1));
    b = parseFloat(b.effective_rate.substring(0, b.effective_rate.length-1));
   // console.log(a,b)
    if (a < b)
        return -1;
    if (a > b)
        return 1;
    return 0;
};

// respond to the home page: 'effectiverate.ejs';
router.get('/effectiverate', function(req, res, next) {
    //mccV = 5812;
    var erates = [];
    var op = [];

    //extract data from collection of effectiverate by filer of MCC code;
    db3.effectiverate.find({MCC: Number(mccV)},{"_id": 0}, function(err, effectiverate1){

        //find distinct effectiverate;
        for(let i = 0; i < effectiverate1.length; i++) {
            if(!(erates.indexOf(effectiverate1[i]["Effectiverates"]) > -1 )) {
                erates.push(effectiverate1[i].Effectiverates);
            }
        }
        //calculate the amount of each effectiverate and push them into json array;
        for(let i = 0; i < erates.length; i++) {
            erates[i]
            let count = 0;
            for(let j = 0; j < effectiverate1.length; j++) {
                if(effectiverate1[j].Effectiverates == erates[i]) {
                    count++;
                }
            }
            var tmp = {};

            tmp["type"]="normal";
            tmp["effective_rate"] = erates[i];
            tmp["count"]=count;
            op.push(tmp);
        }

        //push new effectiverate into json array;
        tmp={};
        tmp["type"]="new";
        tmp["effective_rate"]=effectiveRateValNew;
        //console.log('effectiveRateValNew', effectiveRateValNew);
        tmp["count"]=1;
        // op.push(tmp);

        //push new effectiverate into json array;
        tmp={};
        tmp["type"]="old";
        tmp["effective_rate"]=effectiveRateValOld;
        tmp["count"]=1;
        op.push(tmp);

        for(let i = 0; i < op.length; i++) {
            if(op[i].effective_rate == effectiveRateValNew) {
                op[i].type = "new";
            }
        }

        var arr1 = new Array();
        op.sort(compare);


        arr1.push(op);
        res.json(arr1);
    });
});



//Save clients' data to database;
router.post('/success', function(req, res, next){
    var task = req.body;
    var mccD = req.body.Mcc;
    var mcc = parseInt(mccD);
    mccV = mcc;
    var totalFee = req.body.totalFee;
    var newTotalFee = "$"+totalFee;
    var avgTicket = req.body.avgTicket;
    var newAvgTicket = "$"+avgTicket;
    var volume = req.body.totalVolume;
    var newVolume="$"+volume
    var effectiveRate = Number(totalFee)/Number(volume);
    // old effective rate
    var effectiveRate1 = (effectiveRate*100).toFixed(2)+"%";
    effectiveRateValOld=effectiveRate1;

    //save all clients' data into database;
=======
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
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
    db.clinfo.save(task, function (err, task) {
    });


<<<<<<< HEAD
    //extract effectiverate from effectiverate collection to calculate average effectiverate;
=======
    //extract other effectiverate from database
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
    db2.effectiverate.find({MCC: Number(mcc)}, function(err, effectiverate2){

        var num = 0;
        var sum=0;
<<<<<<< HEAD
        var eR = [];
=======
        var arr = new Array();
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924

        //loop to add all effectiverate and the number of items
        effectiverate2.forEach(function(values) {
            //console.log(parseFloat(values['Effectiverates']));
<<<<<<< HEAD
           // arr.push(parseFloat(values['Effectiverates']));
            num= num + parseFloat(values['Effectiverates']);
            sum = sum+1;
            eR.push(values['Effectiverates']);
          });

        eR.sort();

        if(eR.length % 2 != 0) {
            var tmp = parseInt(eR.length / 2) + 1;
            console.log("tmp", tmp);
            medianV = eR[tmp];
        }

        else {
            var tmp = parseInt(eR.length / 2) + 1;
            //console.log("tmp", tmp);
            medianV = eR[tmp];
        }


        //average of effective rate
        var averageER = (num/sum).toFixed(2)+"%";
        averageER = medianV;
        effectiveRateVal = (num/sum).toFixed(2);
        effectiveRateValNew=averageER;

        var different = (Number(totalFee)-Number((volume)*(num/(sum*100)))).toFixed(2);
        var newDifferent=different;
        var yearSaving = (Number(different)*12).toFixed(2);
        var newYearSaving = yearSaving;
        var threeYearSaving=yearSaving*3;


        //insert clents' old effective rate and new average effective rate into clients' information collection;
=======
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
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
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

<<<<<<< HEAD
=======

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
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
        //render all data to success web page
        res.render('success', {
            data: task,
            title: 'you submitted your information successfully',
            mccD: mccD,
            effectiveRate: effectiveRate1,
<<<<<<< HEAD
            totalVolume: newVolume,
            avgTicket: newAvgTicket,
            totalFee: newTotalFee,
            values: averageER,
            monthlySaving: newDifferent,
            yearlySaving: newYearSaving,
            threeYearSaving:threeYearSaving
=======
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
>>>>>>> 553429b811076578c12ea2aca6c15ea336974924
       });
    });
});

module.exports = router;
