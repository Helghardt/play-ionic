/*global Firebase, console, angular */
angular.module('generic-client.services.everything', [])

    .service('Everything', function ($http, API) {
        'use strict';
        var self = this;

        self.list = function () {
            return $http.get(API + '/list/');
        };

        self.create = function (title, rating) {
            return $http.post(API + '/create/', {
                recipe: 'rate_everything',
                title: title,
                text: '',
                rating: parseInt(rating)
            });
        };
    });