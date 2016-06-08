var express = require("express");
var request = require("request");
var router = express.Router();
var hbs = require("hbs");

var url = "http://gank.io/api/data/%E7%A6%8F%E5%88%A9/10/1";
var HISTORY_URL = "http://gank.io/api/day/history";
var DATA_URL = "http://gank.io/api/day/";
var FULI_URL = "http://gank.io/api/data/%E7%A6%8F%E5%88%A9/";

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index");
});

router.get("/main", function(req, res, next) {
    res.render("main");
});

router.get("/data", function(req, res, next) {
    res.render("data");
});
/**
*
* @GET date 请求 date 该日的日期 eg: 2016/06/07
* @desc 获取某个日期的所有分享数据
*
**/
router.get("/getData/:year/:month/:day", function(req, res, next) {
    var year = req.params.year;
    var month = req.params.month;
    var day = req.params.day;
    request(DATA_URL + year + "/" + month + "/" + day, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            res.end(body);
        }
    });
});

/**
*
* @GET void
* @desc 获取有分享信息的所有日期
*
**/
router.get("/getDate", function(req, res, next) {
    request(HISTORY_URL, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            res.end(body);
        }
    });
});

router.get("/getFuli/:count/:page", function(req, res, next) {
    var count = req.params.count;
    var page = req.params.page;

    request(FULI_URL + count + "/" + page, function(error, response, body) {
        if(!error && response.statusCode === 200) {
            res.end(body);
        }
    });
});

router.get("/%7B[%7B%20result[0].url%20%7D]%7D", function(req, res, next) {
    res.send(200);
    res.end();
});

module.exports = router;
