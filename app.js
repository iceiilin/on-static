// Copyright 2016, EMC, Inc.
/* jshint node: true */

"use strict";

var di = require('di');

module.exports = Runner;

di.annotate(Runner, new di.Provide('app'));
di.annotate(Runner, new di.Inject(
    'Http.Server',
    'Services.Configuration',
    'Logger',
    'Promise'
)
);
function Runner(
    HttpService,
    configuration,
    Logger,
    Promise
) {
    var logger = Logger.initialize("app");

    var services = [];

    var defaultEndpoints = [
        {
            "address": "0.0.0.0",
            "port": 9090,
            "routers": "northbound"
        },
        {
            "address": "0.0.0.0",
            "port": 9080,
            "routers": "southbound"
        }
    ];

    function start() {
        return Promise.resolve()
            .then(function () {
                var endpoints = configuration.get('httpEndpoints', defaultEndpoints);
                services = Promise.map(endpoints, function (endpoint) {
                    return new HttpService(endpoint);
                }).each(function (service) {
                    return service.start();
                });

                return services;
            });
    }

    function stop() {
        return Promise.map(services, function (service) {
            return service.stop();
        })
    }

    return {
        start: start,
        stop: stop
    };
}
