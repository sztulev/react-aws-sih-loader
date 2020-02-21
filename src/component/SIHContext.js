import React from 'react';

class AWSSIHConfig {

    constructor(endpoint, bucket) {
        this.endpoint = endpoint;
        this.bucket = bucket;
    }

}

const SIHContext = React.createContext();

export { AWSSIHConfig, SIHContext };