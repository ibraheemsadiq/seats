var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var file = './config/constraints.json'

/* GET users listing. */
router.get('/', function(req, res, next) {
    jsonfile.readFile(file, function(err, obj) {
        var arr = Object.keys(obj).map(function (key) { return obj[key]; });
        res.send(arr);
    })
});

module.exports = router;
