import React, { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';

const defaultConfig = {
    width: null,
    height: null,
    resizeMode: 'cover',
    normalize: false,
    grayscale: false,
    previewGrayscale: false
}

function AWSSIHContext(props) {

    const { config } = props;

    const mergedConfig = { ...defaultConfig, ...config };

    if (!mergedConfig.endpoint)
        throw `Missing configuration 'endpoint'`;

    if (!mergedConfig.bucket)
        throw `Missing configuration 'bucket'`;

    return (
        <SIHContext.Provider value={mergedConfig}>
            {props.children}
        </SIHContext.Provider>);
}

export { AWSSIHContext };
