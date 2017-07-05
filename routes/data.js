var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var file = './current_data/current.json'
var fs = require("fs-extra");
var dateTime = require('node-datetime');
/* GET users listing. */
router.get('/', function(req, res, next) {
    jsonfile.readFile(file, function(err, obj) {
        var arr = Object.keys(obj).map(function (key) { return obj[key]; });
        res.send(arr);
    })
});

/* GET users listing. */
router.get('/save', function(req, res, next) {
    console.log('savs------------------------------------------------');

    // var obj = JSON.stringify(req.query.data);
    var data = JSON.parse(req.query.data.replace(/\\\//g, ""));
    try {
        var dt = dateTime.create();
        var formatted = dt.format('Y_m_d____H_m_S');

        fs.copySync(file, __dirname+'/../data_history/'+formatted+'.json');
        jsonfile.writeFile(file, data, {spaces: 2}, function(err) {
            res.send('ok');
            console.error(err);
        })
    } catch (err) {
        console.error(err)
    }

});
module.exports = router;
