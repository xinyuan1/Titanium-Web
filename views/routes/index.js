var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var  db = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['clinfo']);
var db2 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['effectiverate']);
var db3 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['mcc']);
var db4 = mongojs('mongodb://zhiguo:zhiguowang1207@ds137230.mlab.com:37230/mytasklist_zhiguo', ['count']);

var effectiveRateValOld = -1;
var effectiveRateValNew=-1;
var mccV = -1;
var medianV = -1;

//respond the home page: 'index.ejs';
router.get('/', function(req, res, next) {
        res.render('index',
            { title: ' '
          });
});


//respond the home page: 'success.ejs';
router.get('/success', function(req, res, next) {
    res.send("Opps, you didn't input your information yet");
});


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
    db.clinfo.save(task, function (err, task) {
    });


    //extract effectiverate from effectiverate collection to calculate average effectiverate;
    db2.effectiverate.find({MCC: Number(mcc)}, function(err, effectiverate2){

        var num = 0;
        var sum=0;
        var eR = [];

        //loop to add all effectiverate and the number of items
        effectiverate2.forEach(function(values) {
            //console.log(parseFloat(values['Effectiverates']));
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

        //render all data to success web page
        res.render('success', {
            data: task,
            title: 'you submitted your information successfully',
            mccD: mccD,
            effectiveRate: effectiveRate1,
            totalVolume: newVolume,
            avgTicket: newAvgTicket,
            totalFee: newTotalFee,
            values: averageER,
            monthlySaving: newDifferent,
            yearlySaving: newYearSaving,
            threeYearSaving:threeYearSaving
       });
    });
});

module.exports = router;
