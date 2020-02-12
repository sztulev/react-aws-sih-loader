import React, { useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';

const defaultContainerStyle ={
    display: 'flex',
    overflow: 'hidden',  
    backgroundSize: '100% 100%'
}

const defaultImageStyle = {
    opacity: 0,
    transition: 'opacity .5s ease'
}


function _encode(endpoint, param_obj) {
    const obj_str = JSON.stringify(param_obj);
    console.log(obj_str);
    let ep = endpoint.endsWith('/') ? endpoint : endpoint + '/';
    const encoded_url = ep + Buffer.from(obj_str).toString("base64");

    console.log(encoded_url);

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
    
    console.log(obj);

    return obj;
}

function Img({previewUrl, url, width, height}) {

    const [imgStyle, setImgStyle] = useState({...defaultImageStyle, width, height});

    const containerStyle = { ...defaultContainerStyle, backgroundImage: `url(${previewUrl})` };

    const onload = () => {
        setImgStyle({...imgStyle, opacity: 1});
    }

    return (
        <div className='sih-image-container' style={containerStyle}>
            <img src={url} style={imgStyle} onLoad={onload}/>
        </div>)

}

function BackgroundImg(props) {

    const {
        previewUrl,
        url,
        style
    } = props;

    const className = props.className || 'sih-background-image';

    const [backgroundImage, setBackgroundImage] = useState(previewUrl);

    const onload = () => {
        console.log('Image loaded');
        setBackgroundImage(url);
    }

    const loadImg = () => {
        console.log('loading image')
        const img = new Image();
        img.onload = onload;
        img.src = url;
    }

    useEffect( ()=> {
        // const wait = Math.floor(Math.random() * 500);
        // setTimeout(loadImg, wait);
        loadImg();
    }, []); 

    const containerStyle = {
        ...style,
        backgroundImage: `url(${backgroundImage})`,
        transition: 'background .5s linear'
    }
    
    return (
    <div className={className} style={containerStyle}>
        {props.children}
    </div>)
}

function SIHImage(props) {
    const {
        endpoint, 
        bucket,
        resizeMode,
        grayscale,
        normalize,
        grayscalePreview
    } = useContext(SIHContext);

    const obj = _construct_param_obj(
        bucket, 
        props.src, 
        props.width, 
        props.height, 
        props.resizeMode || resizeMode,
        grayscale,
        normalize );


    const url = _encode(endpoint, obj);

    const previewObj = _construct_param_obj(
        bucket, 
        props.src, 
        null, 
        50, 
        props.resizeMode || resizeMode,
        grayscalePreview,
        false );
    
    const previewUrl = _encode(endpoint, previewObj);

    return (<Img previewUrl={previewUrl} url={url} width={props.width} height={props.height}/>);
}

function SIHBackgroundImage(props) {
    const {
        endpoint, 
        bucket,
        width,
        height,
        resizeMode,
        grayscale,
        normalize,
        grayscalePreview
    } = useContext(SIHContext);

    const obj = _construct_param_obj(
        bucket, 
        props.src, 
        props.width || width, 
        props.height || height, 
        props.resizeMode || resizeMode,
        grayscale,
        normalize );


    const url = _encode(endpoint, obj);

    const previewObj = _construct_param_obj(
        bucket, 
        props.src, 
        null, 
        50, 
        props.resizeMode || resizeMode,
        grayscalePreview,
        false );
    
    const previewUrl = _encode(endpoint, previewObj);

    return (
        <BackgroundImg previewUrl={previewUrl} url={url} style={props.style} className={props.className}>
            {props.children}
        </BackgroundImg>); 
}

SIHImage.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    resizeMode: PropTypes.oneOf(['fill', 'cover', 'contain', 'inside', 'outside']),
}

export { SIHImage , SIHBackgroundImage };

