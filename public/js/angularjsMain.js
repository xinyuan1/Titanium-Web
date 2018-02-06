var app = angular.module('myApp', []);
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
        }
        else if(total < 100) {
            $scope.errorMsg = `Total percentage is ${total} which should be equal to 100`;
        }
        else {
            reset();
        }
    }

    $scope.Category = function () {
        $scope.mccList = $scope.mccV[$scope.sel_attr];
    }

    $scope.divisionOp1 = function () {
        $scope.avgTicket = ((parseInt($scope.a) || 0) + (parseInt($scope.b) || 0) + (parseInt($scope.c) || 0)
            + (parseInt($scope.d) || 0) + (parseInt($scope.e) || 0)) / parseInt($scope.tranXns);
    }

    $scope.divisionOp2 = function () {
        $scope.tranXns = ((parseInt($scope.a) || 0) + (parseInt($scope.b) || 0) + (parseInt($scope.c) || 0)
            + (parseInt($scope.d) || 0) + (parseInt($scope.e) || 0)) / parseInt($scope.avgTicket);
    }

    $scope.cor = () => {
        $scope.avgTicket = ((parseInt($scope.a) || 0) + (parseInt($scope.b) || 0) + (parseInt($scope.c) || 0)
            + (parseInt($scope.d) || 0) + (parseInt($scope.e) || 0)) / parseInt($scope.tranXns);
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
        $scope.zipcode = undefined; // zip
        $scope.eMail = "";

        $scope.sel_attr = "";
        $scope.mccCodes = "";
        $scope.mccList = undefined;

        $scope.retailV = 0;
        $scope.ecomerceV = 0;
        $scope.motoV = 0;
        $scope.otherV = 0;

        $scope.a = undefined;
        $scope.b = undefined;
        $scope.c = undefined;
        $scope.d = undefined;
        $scope.e = undefined;
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

        $scope.myForm.a.$setUntouched();
        $scope.myForm.b.$setUntouched();
        $scope.myForm.c.$setUntouched();
        $scope.myForm.d.$setUntouched();
        $scope.myForm.e.$setUntouched();
    }

});
