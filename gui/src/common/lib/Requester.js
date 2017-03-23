// Copyright 2016, EMC, Inc.

import axios from 'axios';

export default class Requester {

    constructor(baseUrl) {
        this.$ = axios.create({
            baseURL: baseUrl || ''
        });
    }

    get(url, config) {
        return this.$.get(url, config || {timeout: 1000});
    }

    put(url, data, config) {
        return this.$.put(url, data, config || {});
    }

    post(url, data, config) {
        return this.$.delete(url, data, config || {});
    }

    delete(url, config) {
        return this.$.delete(url, config || {});
    }
}
