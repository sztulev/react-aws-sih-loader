import React, { useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';
import { ConfigPropType } from './AWSSIHConfig.jsx';

const defaultContainerStyle ={
    display: 'flex',
    width:'fit-content',
    height:'fit-content',
    overflow: 'hidden',  
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
}

const defaultImageStyle = {
    opacity: 0,
    transitionProperty: 'opacity'
}

function _encode(endpoint, param_obj) {
    const obj_str = JSON.stringify(param_obj);
    let ep = endpoint.endsWith('/') ? endpoint : endpoint + '/';
    const encoded_url = ep + Buffer.from(obj_str).toString("base64");
    return encoded_url;
}

function _construct_param_obj(
    bucket, 
    key, 
    width, 
    height, 
    resizeMode,
    grayscale,
    normalize) {
    const obj = {};

    obj.bucket = bucket;
    obj.key = key;

    const edits = {};

    if (width || height) {
        const resize = {'fit': resizeMode || 'cover'};
        if (width)
            resize.width = width;
        if (height)
            resize.height = height;

        edits.resize =  resize ;
    }

    if (normalize)
        edits.normalise = true;

    if (grayscale)
        edits.grayscale = true;

    obj.edits = edits;
    
    return obj;
}

function _create_url(key, config) {
    const params = _construct_param_obj(
        config.bucket, 
        key, 
        config.width, 
        config.height, 
        config.resizeMode,
        config.grayscale,
        config.normalize );

    const url = _encode(config.endpoint, params);

    return url;
}

function _create_urls(key, config) {

    const previewObj = _construct_param_obj(
        config.bucket, 
        key, 
        config.previewWidth, 
        config.previewHeight, 
        config.previewResizeMode || config.resizeMode,
        config.previewGrayscale,
        false );
    
    const previewUrl = _encode(config.endpoint, previewObj);

    const url = _create_url(key, config);

    return { url, previewUrl };
}

function Img({ url, width, height, style, className}) {
    return (<img src={url} style={style} className={className} width={width} height={height} />);
}

function SIHImage(props) {
    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };  

    const url = _create_url(props.src, config);

    return (<Img 
        url={url} 
        width={props.width} 
        height={props.height}
        style={props.style} 
        className={props.className}
    />);
}

function LazyLoadImg({previewUrl, url, width, height, style, className, imgClassname, transitionDuration, transitionTimingFunction}) {

    const [imgStyle, setImgStyle] = useState({...defaultImageStyle, width, height, transitionDuration, transitionTimingFunction});

    const [imgSrc, setImgSrc] = useState();

    const containerStyle = { ...defaultContainerStyle, ...style, backgroundImage: `url(${previewUrl})` };

    const onload = () => {
        setImgStyle({...imgStyle, opacity: 1});
    };

    useEffect( ()=> {
        setImgSrc(url);
    }, []); 

    return (
    <div className={className || 'sih-image-container'} style={containerStyle}>
        <img src={imgSrc} style={imgStyle} onLoad={onload} className={imgClassname}/>
    </div>);
}

function SIHLazyLoadImage(props) {
    const cxtConfig = useContext(SIHContext);
    
    const config = { ...cxtConfig, ...props.config };  

    const { url, previewUrl } = _create_urls(props.src, config);

    return (<LazyLoadImg 
        previewUrl={previewUrl} 
        url={url} 
        width={props.width} 
        height={props.height}
        style={props.style} 
        className={props.className}
        imgClassname = {props.imgClassName}
        transitionDuration={config.transitionDuration}
        transitionTimingFunction={config.transitionTimingFunction}
    />);
}


function BackgroundImg(props) {
    const {
        url,
        style
    } = props;

    const className = props.className || 'sih-background-image';

    const containerStyle = {
        ...style,
        backgroundImage: `url(${url})`
    };
    
    return (
    <div className={className} style={containerStyle}>
        {props.children}
    </div>);
}

function SIHBackgroundImage(props) {

    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };  

    const url = _create_url(props.src, config);

    return (
    <BackgroundImg url={url} style={props.style} className={props.className}>
        {props.children}
    </BackgroundImg>); 
}

function LazyLoadBackgroundImg(props) {

    const {
        previewUrl,
        url,
        style,
        transitionDuration,
        transitionTimingFunction
    } = props;

    const className = props.className || 'sih-lazyload-background-image';

    const [backgroundImage, setBackgroundImage] = useState(previewUrl);

    const onload = () => {
        setBackgroundImage(url);
    };

    const loadImg = () => {
        const img = new Image();
        img.onload = onload;
        img.src = url;
    };

    useEffect( ()=> {
        loadImg();
    }, []); 

    const containerStyle = {
        ...style,
        backgroundImage: `url(${backgroundImage})`,
        transitionProperty: 'background',
        transitionDuration: transitionDuration,
        transitionTimingFunction: transitionTimingFunction
    };
    
    return (
    <div className={className} style={containerStyle}>
        {props.children}
    </div>);
}

function SIHLazyLoadBackgroundImage(props) {

    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };  

    const { url, previewUrl } = _create_urls(props.src, config);

    return (
    <LazyLoadBackgroundImg 
            previewUrl={previewUrl} 
            url={url} 
            style={props.style} 
            className={props.className}
            transitionDuration={config.transitionDuration}
            transitionTimingFunction={config.transitionTimingFunction}>
        {props.children}
    </LazyLoadBackgroundImg>); 
}

SIHImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    config: PropTypes.exact(ConfigPropType)
}

SIHLazyLoadImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    imgClassName: PropTypes.string,
    style: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    config: PropTypes.exact(ConfigPropType)
}

SIHBackgroundImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.string,
    config: PropTypes.exact(ConfigPropType)
}

SIHLazyLoadBackgroundImage.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.string,
    config: PropTypes.exact(ConfigPropType)
}

export { SIHImage, SIHLazyLoadImage , SIHBackgroundImage, SIHLazyLoadBackgroundImage };

