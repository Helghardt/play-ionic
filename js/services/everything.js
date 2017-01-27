/*global Firebase, console, angular */
angular.module('generic-client.services.everything', [])

    .service('Everything', function ($http, API) {
        'use strict';
        var self = this;

        self.get = function () {
            return $http.get(API + '/create/');
        };

        self.create = function (title) {
            return $http.post(API + '/create/', {
                recipe: 'rating',
                title: title,
                text: '',
                rating: 5
            });
        };
    });