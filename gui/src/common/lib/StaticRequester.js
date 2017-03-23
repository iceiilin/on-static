// Copyright 2016, EMC, Inc.

import Requester from 'common-src/Requester';

export default class StaticRequester extends Requester{

    constructor(baseUrl) {
        super(baseUrl);
    }

    getImages() {
        let url = "images";
        return this.get(url);
    }

    uploadIso(name, data) {
        let url = "iso?name=" + name;
        return this.put(url, data);
    }

    getIsos() {
        let url = "iso";
        return this.get(url);
    }

    deleteIso(name) {
        let url = "iso?name=" + name;
        return this.delete(url);
    }
}
