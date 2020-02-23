import React, { useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { SIHContext } from './SIHContext';
import { ConfigPropType } from './AWSSIHConfig.jsx';

import BackgroundImgAnimatedDiv, { fadeInAnimation } from './BackgroundImgAnimated.jsx';


const defaultContainerStyle ={
    display: 'flex',
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

    if (config.debug)
        console.debug(params);

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

    if (config.debug)
        console.debug(previewObj);
    
    const previewUrl = _encode(config.endpoint, previewObj);

    const url = _create_url(key, config);

    return { url, previewUrl };
}

function _debounce(fn, time) {
    let timeout;
  
    return function() {
      const functionCall = () => fn.apply(this, arguments);
      
      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    }
}

function Img({ url, alt, width, height, style, className}) {
    return (<img src={url} style={style} className={className} width={width} height={height} alt={alt}/>);
}

function SIHImage(props) {

    if (!props.src)
        return null;

    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };  

    const [url, setUrl] = useState(_create_url(props.src, config));

    useEffect(()=>{
        const newConfig = { ...cxtConfig, ...props.config };  
        setUrl(_create_url(props.src, newConfig));
    },[props.src,...Object.values(config)]);

    return (<Img 
        url={url} 
        alt={props.alt}
        width={props.width} 
        height={props.height}
        style={props.style} 
        className={props.className}
    />);
}

function LazyLoadImg({previewUrl, url, alt, width, height, style, className, imgClassname, transitionDuration, transitionTimingFunction}) {

    const [imgStyle, setImgStyle] = useState({...defaultImageStyle, width, height, transitionDuration, transitionTimingFunction});

    const [imgSrc, setImgSrc] = useState();

    const containerStyle = { ...defaultContainerStyle, ...style, backgroundImage: `url(${previewUrl})` };

    const onload = () => {
        setImgStyle({...imgStyle, opacity: 1});
    };

    useEffect( ()=> {
        setImgSrc(url);
    }, [url]); 

    return (
    <div className={className || 'sih-image-container'} style={containerStyle}>
        <img src={imgSrc} style={imgStyle} onLoad={onload} className={imgClassname} alt={alt}/>
    </div>);
}

function SIHLazyLoadImage(props) {

    if (!props.src)
        return null;

    const cxtConfig = useContext(SIHContext);
    
    const config = { ...cxtConfig, ...props.config };  

    const [{ url, previewUrl }, setUrls] = useState(_create_urls(props.src, config));

    useEffect(()=>{
        const newConfig = { ...cxtConfig, ...props.config };  
        setUrls(_create_urls(props.src, newConfig));

    },[props.src,...Object.values(config)]);

    return (<LazyLoadImg 
        previewUrl={previewUrl} 
        url={url} 
        alt={props.alt}
        width={props.width} 
        height={props.height}
        style={props.style} 
        className={props.className}
        imgClassname = {props.imgClassName}
        transitionDuration={config.transitionDuration}
        transitionTimingFunction={config.transitionTimingFunction}
    />)
}

function BackgroundImageFadeIn(props) {
    const {
        url,
        style,
        className,
        debug
    } = props;

    const [state, setState] = useState({ 
        url: url, 
        loading: 0 });

    useEffect(()=>{
        // Progress loadState from 0 to 2
        if (state.loading === 1) {
            setTimeout(()=>{
                setState({...state, loading: 2 });      
            },100);
        }

    },[state]);

    useEffect(()=>{
        // Init animate into new image on URL changed
        if (url!==state.url) {
            if (debug)
                console.debug('Background image changed');            
            setState({ url: url, loading: 1 }) 
        }   
    },[url]);

    const opacity = state.loading >=2 ? 1 : 0;
    const animation = state.loading >= 2? fadeInAnimation : null;

    return (
        <BackgroundImgAnimatedDiv   src={state.url} 
                                    zIndex={0}
                                    opacity={opacity} 
                                    animation={animation} 
                                    className={className} 
                                    style={style}>
            {props.children}
        </BackgroundImgAnimatedDiv>);
}

function LazyLoadBackgroundImg(props) {
    const { previewUrl, url, style, debug } = props;

    const className = props.className || '';

    const [imgUrl, setImgUrl] = useState(previewUrl);

    useEffect(()=>{
        if ( url !== imgUrl);
            loadImg();
    },[url]);

    const loadImg = _debounce(() => {
        if (debug)
            console.debug('loading Image %s', url);               
        const img = new Image();
        img.onload = () => setImgUrl(url);
        img.src = url;
    },1000);

    return (
        <BackgroundImageFadeIn url={imgUrl} className={className} style={style} debug={debug}>
            {props.children}
        </BackgroundImageFadeIn>
    )
}


function SIHBackgroundImage(props) {

    if (!props.src)
    return null;

    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };  

    return (
        <LazyLoadBackgroundImg 
                previewUrl={null} 
                url={_create_url(props.src, config)} 
                style={props.style} 
                className={props.className}
                debug={config.debug}>
            {props.children}
        </LazyLoadBackgroundImg>); 
}

function SIHLazyLoadBackgroundImage(props) {

    if (!props.src)
        return null;

    const cxtConfig = useContext(SIHContext); 

    const config = { ...cxtConfig, ...props.config };

    const { url, previewUrl } = _create_urls(props.src, config);

    return (
        <LazyLoadBackgroundImg 
                previewUrl={previewUrl} 
                url={url} 
                style={props.style} 
                className={props.className}>
            {props.children}
        </LazyLoadBackgroundImg>); 
}

// function LazyLoadBackgroundImg2(props) {

//     const {
//         previewUrl,
//         url,
//         style,
//         transitionDuration,
//         transitionTimingFunction
//     } = props;

//     const className = props.className || 'sih-lazyload-background-image';

//     const [backgroundImage, setBackgroundImage] = useState(previewUrl);
//     const [loadState, setLoadState] = useState(0);

//     const onload = () => {
//         setLoadState(1);        
//     };

//     useEffect(()=>{
//         if (loadState > 0 && loadState < 2) {
//             console.log("Setting load state to " + (loadState + 1));
//             setTimeout(()=>setLoadState(loadState+1), 100);        
//         }

//     },[loadState]);

//     const loadImg = (url) => {
//         setTimeout(()=>{
//             console.log('loading img ' + url);
//             const img = new Image();
//             img.onload = onload;
//             img.src = url;
//         },1200);
//     };

//     useEffect (()=>{
//         loadImg(url);
//     }, [url]);

//     const containerStyle = {
//         ...style,
//     };
    

//     console.log(containerStyle);


//     if (loadState === 0)
//         return (
//             <BackgroundImgAnimatedDiv src={previewUrl} className={className} style={containerStyle}>
//                 {props.children}
//             </BackgroundImgAnimatedDiv>);
//     //  if (loadState === 1)
//     //     return (
//     //         <StyledDiv src={previewUrl} zIndex={-1} animation={blurOutAnimation} className={className} style={containerStyle}>
//     //             {props.children}
//     //         </StyledDiv>);   
//      if (loadState === 1)
//         return (
//             <BackgroundImgAnimatedDiv src={url} zIndex={-1} className={className} style={containerStyle}>
//                 {props.children}
//             </BackgroundImgAnimatedDiv>);   
//     if (loadState >= 2)
//         return (
//             <BackgroundImgAnimatedDiv src={url} animation={blurInAnimation} className={className} style={containerStyle}>
//                 {props.children}
//             </BackgroundImgAnimatedDiv>);   

//     }



SIHImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
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
    alt: PropTypes.string,
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

