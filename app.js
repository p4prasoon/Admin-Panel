function alert(a) {
    $(".myalert").css("z-index", "999").css("display", "block").text(a);
    setTimeout(function() {
        $(".myalert").fadeOut("300");
    }, 3000)
}

var app = angular.module('moveinsync', []);
app.filter('capitalize', function() {
    return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
    }
});
app.controller('MainCtrl', function($scope, UserServices, $http) {

    $scope.init = function() {
        $scope.droppedObjects1 = [];
        $scope.dropedUserDetails = [];
        $scope.selected = false;
        $scope.breakdown = false;
        $scope.usrbtn = false;
        $scope.selectedvehicle = [];

        UserServices.httpGetAllListItems('response.json', 'GET', {}).then(function mySucces(response) {
            $scope.vehicleDetails = response.data.vehicleDetails;
            $scope.userDetails = response.data.userDetails;
            $scope.selectedvehicle = $scope.vehicleDetails[0];
            $scope.vhclDetails($scope.selectedvehicle);
            console.log(response.data);
        }, function myError(response) {
            console.log(response.data);
        });
    };
    $scope.init();
    $scope.searchVhcl = '';
    $scope.search = function(row) {
        console.log(row);
        //return (angular.lowercase(row.userinfo.userid).indexOf(angular.lowercase($scope.searchby) || '') !== -1);
    };
    /*Draggable*/

    $scope.allowDrop = function(ev) {
        ev.preventDefault();
    };
    $scope.drag = function(ev) {
        ev.dataTransfer.setData("Text", ev.target.id);
    };

    $scope.drop = function(ev) {
        ev.preventDefault();
        var dat = ev.dataTransfer.getData("Text");
        var data = JSON.parse(dat);

        if (ev.target.id == 'div1' && $scope.dropedUserDetails.indexOf(data) == -1) {
            //ev.target.appendChild(document.getElementById(dat));
            $scope.droppedObjects1.push(data);
            $scope.actions(data);

        } else {
            alert(' Try Again');
        }

    };
    $scope.actions = function(_data) {
        if ($scope.selectedvehicle.AvlblSeat <= 0) alert("No More Seat Available");
        else {
            $scope.selectedvehicle.AvlblSeat = $scope.selectedvehicle.AvlblSeat - 1;

            var x = $scope.userDetails.findIndex(x => x.name == _data.name);
            var iindex = $scope.vehicleDetails.findIndex(x => x.DriverName == $scope.selectedvehicle.DriverName);
            console.log(iindex);

            $scope.userDetails.splice(x, 1);
            //$scope.vehicleDetails[iindex].AvlblSeat = $scope.vehicleDetails[iindex].AvlblSeat-1;
            $scope.progressBar($scope.vehicleDetails[iindex]);
            alert("user Added Successfully");
            $scope.$apply();
        }


    };
    /*Draggable End Here*/


    $scope.dsbld = function(index) {
        if (index == $scope.dsbldindex) return true;
        else return false;
    }

    $scope.moveUser = function() {
        var usersToMove = $scope.selectedvehicle.users;
        console.log(usersToMove);
        angular.forEach(usersToMove, function(_user) {
            $scope.userDetails.push(_user);
        });
        var iindex = $scope.vehicleDetails.findIndex(x => x.DriverName == $scope.selectedvehicle.DriverName);
        $scope.vehicleDetails[iindex].AvlblSeat = 0;
        $scope.vehicleDetails[iindex].dsbld = true;
        $scope.selectedvehicle.AvlblSeat = 0;
        $scope.progressBar($scope.selectedvehicle);
        alert('Users Moved successfully');
        $scope.usrbtn = true;

    }
    $scope.progressBar = function(details) {
        var progress = ((details.TotalSeat - details.AvlblSeat) / details.TotalSeat) * 100;
        $scope.width = progress + '%';
    };

    $scope.vhclDetails = function(details) {
        $scope.selected = true;
        $scope.usrbtn = false;
        $scope.progressBar(details);
        var allDetails = {};
        allDetails = details;
        $scope.selectedvehicle = allDetails;
        if (details.status == 0) {

            $scope.breakdown = true;

        } else {
            $scope.breakdown = false;
        }

    }

});
app.service('UserServices', function($http, $location) {
    var header = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    };
    this.httpGetAllListItems = function(api, method, inputObj) {

        var request = $http({
            method: method,
            url: api,
            data: inputObj,
            headers: header
        });

        return request;
    }

});