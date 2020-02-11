import React, { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';

function AWSSIHConfig(props) {

    const { 
        endpoint, 
        bucket,
        resizeMode,
        grayscale,
        normalize,
        grayscalePreview
    } = props;

    return (
        <SIHContext.Provider value={{
            endpoint, 
            bucket,
            resizeMode,
            grayscale,
            normalize,
            grayscalePreview
        }}>
            {props.children}
        </SIHContext.Provider>);
}

export { AWSSIHConfig };
