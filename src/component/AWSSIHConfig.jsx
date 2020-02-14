import React, { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';


const ConfigPropType = {
    debug: PropTypes.boolean,
    width: PropTypes.number,
    height: PropTypes.number,
    resizeMode: PropTypes.oneOf(['fill', 'contain', 'cover', 'inside', 'outside']),
    grayscale: PropTypes.boolean,
    previewWidth: PropTypes.number, 
    previewHeight: PropTypes.number, 
    previewResizeMode: PropTypes.oneOf(['fill', 'contain', 'cover', 'inside', 'outside']),
    previewGrayscale: PropTypes.boolean,
    transitionDuration: PropTypes.string,
    transitionTimingFunction: PropTypes.string
}


const defaultConfig = {
    debug: false,
    width: null,
    height: null,
    resizeMode: 'cover',
    normalize: false,
    grayscale: false,
    previewWidth: null, 
    previewHeight: 50, 
    previewResizeMode: null,
    previewGrayscale: false,
    transitionDuration: '.5s',
    transitionTimingFunction: 'linear'
}

function AWSSIHContext(props) {

    const upperConfig = useContext(SIHContext);

    const { config } = props;

    const mergedConfig = { ...defaultConfig, ...upperConfig, ...config };

    if (config.debug)
        console.log(mergedConfig);


    if (!mergedConfig.endpoint)
        throw `Missing configuration 'endpoint'`;

    if (!mergedConfig.bucket)
        throw `Missing configuration 'bucket'`;

    
    return (
        <SIHContext.Provider value={mergedConfig}>
            {props.children}
        </SIHContext.Provider>);
}

 

AWSSIHContext.propTypes = {
    config: PropTypes.exact(ConfigPropType)
}

export { AWSSIHContext , ConfigPropType };
