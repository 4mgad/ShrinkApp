"use strict";angular.module("myApp.controllers",[]).controller("MyCtrl1",[function(){}]).controller("MyCtrl2",[function(){}]),angular.module("myApp.filters",[]).filter("interpolate",["version",function(r){return function(n){return String(n).replace(/\%VERSION\%/gm,r)}}]);