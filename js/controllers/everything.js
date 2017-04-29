angular.module('generic-client.controllers.everything', [])

    .controller('EverythingCtrl', function ($scope, $ionicPopup, $ionicModal, $state, $ionicLoading, $translate, Everything) {
        'use strict';

        $scope.submit = function (form) {
            $ionicLoading.show({
                template: $translate.instant("LOADER_SAVING")
            });

            if (form.$valid) {
                Everything.create(form.title.$viewValue, form.rating.$viewValue).then(function (res) {

                    if (res.status === 201) {
                        console.log(res.data);
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: "Success", template: "Nice boet!"});
                    } else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: "Error", template: res.message});
                    }
                }).catch(function (error) {
                    $ionicPopup.alert({title: $translate.instant("AUTHENTICATION_ERROR"), template: error.message});
                    $ionicLoading.hide();
                });

                $state.go('app.home', {});
            }
        };
    })


    .controller('ListCtrl', function ($scope, $state, $http, $window, $ionicModal, $ionicLoading, Everything) {
        'use strict';

        $scope.refreshData = function () {


            var getEverything = Everything.list();

            getEverything.success(
                function (res) {
                    var items = [];

                    console.log(res)

                    for (var i = 0; i < res.data.results.length; i++) {
                        res.data.results[i].id = i;
                        res.data.results[i].rating = res.data.results[i].data.rating;
                        items.push(res.data.results[i]);
                    }

                    $scope.items = items;
                    $window.localStorage.setItem('myEverything', JSON.stringify(items));
                    $scope.nextUrl = res.data.next;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            );

        };

        $scope.loadMore = function () {
            if ($scope.nextUrl) {
                $http.get($scope.nextUrl).success(
                    function (res) {

                        for (var i = 0; i < res.data.results.length; i++) {
                            res.data.results[i].id = i;
                            res.data.results[i].rating = res.data.results[i].data.rating;
                            $scope.items.push(res.data.results[i]);
                        }

                        $scope.nextUrl = res.data.next;
                    }
                );
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.$on('$ionicView.afterEnter', function () {
            if ($window.localStorage.myEverything) {
                $scope.items = JSON.parse($window.localStorage.myEverything);
            }

            $scope.refreshData();
        });
    });