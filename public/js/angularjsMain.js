var app = angular.module('myApp', ['ngAnimate']);
app.controller('myCtrl', function($scope, $http) {
    $http.get("http://localhost:3000/mcc")
    .then(function(response) {
        $scope.mccData = response.data;
        const categories = [];
        const mccCodeV = {};

        for(let i = 0; i < $scope.mccData.length; i++) {
            if(categories.indexOf($scope.mccData[i]["AMEX Industry"].trim()) > -1) {
                let tmp =[];
                tmp = mccCodeV[$scope.mccData[i]["AMEX Industry"].trim()];
                if(tmp.indexOf(`${$scope.mccData[i]["MCC"]} - ${$scope.mccData[i]["MCC DESCRIPTION"].trim()}`) > -1)
                {

                }

                else {
                    tmp.push(`${$scope.mccData[i]["MCC"]} - ${$scope.mccData[i]["MCC DESCRIPTION"].trim()}`);
                }

                mccCodeV[$scope.mccData[i]["AMEX Industry"].trim()]  = tmp;
            }

            else {
                categories.push($scope.mccData[i]["AMEX Industry"].trim());
                let tmp = [];
                tmp.push(`${$scope.mccData[i]["MCC"]} - ${$scope.mccData[i]["MCC DESCRIPTION"].trim()}`);
                mccCodeV[$scope.mccData[i]["AMEX Industry"].trim()] = tmp;
            }
        }
        categories.sort();
        $scope.mccCategories = categories;
        $scope.mccV = mccCodeV;
    });

    $scope.retailV = 0;
    $scope.ecomerceV = 0;
    $scope.motoV = 0;
    $scope.otherV = 0;
    $scope.errorMsg = "";

    function reset() {
        $scope.errorMsg ="";
    }

    $scope.calc = function(p) {
        const total = ($scope.retailV || 0) + ($scope.ecomerceV || 0) + ($scope.motoV || 0) + ($scope.otherV || 0);

        if(total > 100) {
            $scope.errorMsg = `Total percentage is ${total} which should not be greater than 100`;
            //form.$setValidity('charE', true);

        }
        else if(total < 100) {
            $scope.errorMsg = `Total percentage is ${total} which should be equal to 100`;
            $scope.myForm.retail.$valid = false;
        }
        else {
            reset();
        }
    }

    $scope.Category = function () {
        $scope.mccList = $scope.mccV[$scope.sel_attr];
    }

    $scope.divisionOp1 = function () {
        $scope.avgTicket = parseFloat(parseFloat(((parseInt($scope.totalV) || 0)
            / parseInt($scope.tranXns)).toString()).toFixed(2));
    }

    $scope.divisionOp2 = function () {
        $scope.tranXns = parseFloat(parseFloat(((parseInt($scope.totalV) || 0)
            / parseInt($scope.avgTicket)).toString()).toFixed(0));
    }

    $scope.cor = () => {
        $scope.avgTicket = parseFloat(parseFloat(((parseInt($scope.totalV) || 0)
            / parseInt($scope.tranXns)).toString()).toFixed(2));
    }

    $scope.toggle = function () {
        if(!$scope.retail) {
            $scope.retailV = 0;
        }

        if(!$scope.commerce) {
            $scope.ecomerceV = 0;
        }

        if(!$scope.moto) {
            $scope.motoV = 0;
        }

        if(!$scope.other) {
            $scope.otherV = 0;
        }

        $scope.calc();

        if(!$scope.retail && !$scope.commerce && !$scope.moto && !$scope.other) {
            reset();
        }
    }

    $scope.resetForm = function () {
        $scope.fullName = undefined;
        $scope.mobile = "";
        $scope.companyName = undefined;
        $scope.currentProvider = undefined;
        $scope.zipcode = undefined;
        $scope.eMail = "";

        $scope.sel_attr = "";
        $scope.mccCodes = "";
        $scope.mccList = undefined;

        $scope.retailV = 0;
        $scope.ecomerceV = 0;
        $scope.motoV = 0;
        $scope.otherV = 0;

        $scope.totalV = undefined;
        $scope.totalFee = undefined;

        $scope.avgTicket = undefined;
        $scope.tranXns = undefined;

        $scope.retail = false;
        $scope.commerce = false;
        $scope.moto = false;
        $scope.other = false;

        $scope.myForm.avgTicket.$setUntouched();
        $scope.myForm.tranXns.$setUntouched();
        $scope.myForm.myInput.$setUntouched();
        $scope.myForm.email.$setUntouched();
        $scope.myForm.Mcc.$setUntouched();
        reset();

        $scope.myForm.retail.$setUntouched();
        $scope.myForm.commerce.$setUntouched();
        $scope.myForm.moto.$setUntouched();
        $scope.myForm.other.$setUntouched();

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

});


