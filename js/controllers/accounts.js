angular.module('generic-client.controllers.accounts', [])

    .controller('LoginCtrl', function ($scope, $window, $ionicModal, $state, $ionicLoading, $rootScope, $translate, User, $ionicPopup) {
        'use strict';

        $ionicModal.fromTemplateUrl('templates/accounts/signup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.ModalSignup = modal;
        });

        $ionicModal.fromTemplateUrl('templates/accounts/forgot.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.ModalForgot = modal;
        });

        $scope.ShowModalSignup = function (){
            $scope.ModalSignup.show()
        };

        $scope.ShowModalForgot = function (){
            $scope.ModalForgot.show()
        };

        $scope.CloseModalSignup = function (){
            $scope.ModalSignup.hide()
        };

        $scope.CloseModalForgot = function (){
            $scope.ModalForgot.hide()
        };

        $scope.registerUser = function (form) {
            if (form.$valid) {
                $ionicLoading.show({
                    template: $translate.instant("LOADER_SIGNING_UP")
                });

                User.register(form.email.$viewValue, form.password1.$viewValue, form.password2.$viewValue)
                    .then(function (res) {
                    if (res.status === 201) {
                        $ionicLoading.hide();
                        $rootScope.user = JSON.parse($window.localStorage.getItem('user'));

                        $state.go('app.home');

                    } else {
                        $ionicPopup.alert({title: $translate.instant("ERROR"), template: res.data});
                    }

                    $ionicLoading.hide();
                    $scope.CloseModalSignup();
                }).catch(function (error) {
                    $ionicPopup.alert({title: $translate.instant("ERROR"), template: error});
                    $ionicLoading.hide();
                });
            }
        };

        $scope.logIn = function (form) {
            if (form.$valid) {
                $ionicLoading.show({
                    template: $translate.instant("LOADER_LOGGING_IN")
                });

                User.login(form.identifier.$viewValue, form.password.$viewValue).then(function (res) {
                    $ionicLoading.hide();
                    $rootScope.user = JSON.parse($window.localStorage.getItem('user'));

                    if (res.status === 200) {
                        $state.go('app.home');
                    } else {
                        $ionicPopup.alert({title: $translate.instant("ERROR"), template: res.data.message});
                    }
                }).catch(function (error) {
                    $ionicPopup.alert({title: $translate.instant("AUTHENTICATION_ERROR"), template: error.data.message});
                    $ionicLoading.hide();
                });
            }
        };

        $scope.resetPassword = function (form) {
            if (form.$valid) {
                $ionicLoading.show({
                    template: $translate.instant("LOADER_RESETTING")
                });

                $scope.CloseModalForgot();

                User.resetPassword(form.identifier.$viewValue, form.company_id.$viewValue).then(function (res) {
                    $ionicLoading.hide();

                    if (res.status === 200) {
                        $ionicPopup.alert({title: $translate.instant("SUCCESS"), template: "Please check your inbox and follow the directions received in the email."});
                    } else {
                        $ionicPopup.alert({title: $translate.instant("ERROR"), template: res.data.message});
                    }
                }).catch(function (error) {
                    $ionicPopup.alert({title: $translate.instant("PASSWORD_RESET_ERROR"), template: error.data.message});
                    $ionicLoading.hide();
                });
            }
        };
    });