var myApp = angular.module('app',[]);

myApp.controller('AppCtrl',['$scope','$http',function($scope,$http){

    $scope.addContact = function () {
        console.log("contact button is clicked");
        console.log($scope.contact);
        $http.post('/contactList',$scope.contact).then(function(req,res){
            console.log(res);
            refresh();
        });
    };

    var refresh = function(){
        $http.get('/contactList').then(function(response){
            console.log("I get the data from I requset.");
            console.log(response.data);
            $scope.contactList = response.data;
            $scope.contact = '';
        });
    };
    refresh();

    $scope.remove = function(id){
        console.log(id);
        $http.delete('/contactList/'+id).then(function(req,res){
            refresh();
        });
    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/contactList/'+id).then(function(req,res){
            console.log(req);
            $scope.contact = req.data;
        });
    };

    $scope.update = function(){
        console.log($scope.contact._id);
        $http.put('/contactList/'+$scope.contact._id, $scope.contact).then(function(req,res){
            refresh();
        });
    };
}])