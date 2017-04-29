// Ionic Starter App
angular.module('generic-client', ['ionic',
    'intlpnIonic',
    'ngMessages',
    'ngImgCrop',
    'ngFileUpload',
    'ngCordova',
    'pascalprecht.translate',
    'generic-client.controllers',
    'generic-client.controllers.accounts',
    'generic-client.controllers.home',
    'generic-client.controllers.everything',
    'generic-client.services',
    'generic-client.services.accounts',
    'generic-client.services.everything'])

    //.constant('API', 'http://130.211.68.207/api/1')
    .constant('API', 'http://localhost:2468/api/1')
    .constant('REFRESH_INTERVAL', 3000)

    .config(function ($httpProvider, $ionicConfigProvider, $compileProvider) {
        'use strict';
        // Switch off caching:
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.tabs.position('bottom');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|bitcoin):/);
        // Insert JWT token into all api requests:
        $httpProvider.interceptors.push('authInterceptor');
    })

    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .useStaticFilesLoader({
                prefix: 'translations/',
                suffix: '.json'
            })
            .preferredLanguage('en')
            .fallbackLanguage('en')
            .useMissingTranslationHandlerLog()
            .useSanitizeValueStrategy('sanitize');
    }])

    .run(function ($window, $ionicPlatform, $rootScope, Auth, $state, $translate) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
                StatusBar.overlaysWebView(true);
                StatusBar.show();
            }
        });

        if ($window.localStorage.getItem('language')) {
            $translate.use($window.localStorage.getItem('language'));
        }

        if ($window.localStorage.getItem('user')) {
            $rootScope.user = JSON.parse($window.localStorage.getItem('user'));
        }

        $rootScope.logout = function () {
            Auth.logout();
            $state.go('login');
        };
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider

            // Accounts
            .state('login', {
                url: '/login',
                templateUrl: 'templates/accounts/login.html',
                controller: 'LoginCtrl'
            })

            .state('loading', {
                url: '/loading',
                templateUrl: 'templates/elements/loading.html',
                params: {
                    amount: null
                }
            })

            // App
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/elements/menu.html',
                controller: 'AppCtrl'
            })

            // Home
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home/index.html',
                        controller: 'ListCtrl'
                    }
                }
            })

            // Everything
            .state('app.everything', {
                url: '/everything/',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/everything/create.html',
                        controller: 'EverythingCtrl'
                    },
                    params: {
                        title: null
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
