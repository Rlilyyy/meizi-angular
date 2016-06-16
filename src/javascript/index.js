require("../component/stylesheets/common.less");
require("../component/stylesheets/header.less");
require("font-awesome/css/font-awesome.min.css");
require("../stylesheet/index.less");
require("../stylesheet/data.less");

// let $ajax = require("../component/javascripts/ajax.js");

let URL = {
    // HISTORY_URL: "http://localhost:5000/getDate",
    HISTORY_URL: "./getDate",
    // DATA_URL: "http://localhost:5000/getData"
    DATA_URL: "./getData/",
    FULI_URL: "./getFuli/10/"
};

let angular = require("angular");
let ngRoute = require("angular-route");

let app = angular.module("ameizi", [ngRoute]);

app.service("pageService", function() {
    this.page = 1;
    this.data = [];
    this.scrollEvent = {};
    this.scrollTop = 0;

    this.scrollToTop = function() {
        document.body.scrollTop = "0px";
    }
});

app.config(($interpolateProvider) => {
    $interpolateProvider.startSymbol("{[{");
    $interpolateProvider.endSymbol("}]}");
});



app.controller("welfaresController", function($scope, $http, pageService) {
    let container = document.getElementById("container");
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let isBottom = function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        return (document.body.scrollHeight - clientHeight - 100) <= scrollTop;
    };
    $scope.loaded = false;
    $scope.data = [];

    pageService.scrollToTop();

    $scope.refresh = function(results) {
        Array.prototype.push.apply($scope.data, results.map(obj => {
            obj["publishedAt"] = obj["publishedAt"].split("T")[0];
            return obj;
        }));
        $scope.loaded = true;
    };

    $scope.getData = function() {
        $scope.loaded = false;
        $http.get(URL.FULI_URL + (pageService.page++)).success(response => {
            Array.prototype.push.apply(pageService.data, response.results);
            $scope.refresh(response.results);
        });
    };

    pageService.scrollEvent = function() {
        if(!isBottom()) return null;
        if($scope.loaded) {
            $scope.getData();
        }
    };

    window.addEventListener("scroll", pageService.scrollEvent, false);

    if(!!pageService.data.length > 0) {
        $scope.refresh(pageService.data);
    }else {
        $scope.getData();
    }

    container.addEventListener("click", function(event) {
        let e = window.event || event;
        let target = e.srcElement || e.target;

        if(target.nodeName === "A") {
            pageService.scrollTop = target.scrollTop - 100;
        }
    }, false);
    document.body.scrollTop = pageService.scrollTop;
}).controller("dataController", function($scope, $http, $routeParams, pageService) {

    let date = $routeParams.date.split("-").join("/");
    let urlReg = /http:(.*?)(.\jpg|.\png)/;

    let fuliDetailElem = document.getElementById("fuli-detail");
    let fuliElem = document.getElementById("fuli");
    let insertSpan = document.getElementById("insert-span");


    $scope.loaded = false;
    $scope.detailFlag = false;
    $scope.isOpen = false;
    $scope.isFirstOpen = false;
    window.removeEventListener("scroll", pageService.scrollEvent);

    pageService.scrollToTop();

    fuliElem.addEventListener("click", function(event) {
        let e = window.event || event;
        let target = e.target;
        if(!$scope.isFirstOpen) {
            let fuliUrl = urlReg.exec(target.style.backgroundImage)[0];
            let imgElem = document.createElement("img");

            imgElem.src = fuliUrl;
            insertSpan.appendChild(imgElem);

            $scope.$apply(function() {
                $scope.detailFlag = true;
            });
            $scope.isFirstOpen = true;
        }else {
            $scope.$apply(function() {
                $scope.detailFlag = true;
            });
        }
    }, false);

    fuliDetailElem.addEventListener("click", function(event) {
        let e = window.event || event;
        $scope.$apply(function() {
            $scope.detailFlag = false;
        });
        // e.preventDefault();
    }, false);

    $http.get(URL.DATA_URL + date).success(response => {
        let results = response.results;
        $scope.data = results;
        $scope.loaded = true;
    });
}).config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "main",
        controller: "welfaresController"
    }).when("/data/:date", {
        templateUrl: "data",
        controller: "dataController"
    });
});
