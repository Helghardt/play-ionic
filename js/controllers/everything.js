angular.module('generic-client.controllers.everything', [])

    .controller('EverythingCtrl', function ($scope, $ionicPopup, $ionicModal, $state, $ionicLoading, $translate, Everything) {
        'use strict';

        $scope.submit = function (form) {
            $ionicLoading.show({
                template: $translate.instant("LOADER_SAVING")
            });

            if (form.$valid) {
                Everything.create(form.title.$viewValue).then(function (res) {

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

                $state.go('app.everything', {});
            }
        };
    });