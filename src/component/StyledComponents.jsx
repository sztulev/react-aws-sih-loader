import styled, { css, keyframes } from 'styled-components';

const fadeInKeyFrames = keyframes`
0% {
    opacity: 0;   
    filter: blur(8px);
}

50% {
    opacity: .5;
    filter: blur(4px);
}

100% {
    opacity: 1;
}`  

const fadeInAnimation = css`${fadeInKeyFrames} .1s ease-in`;

const BackgroundImgAnimatedDiv = styled.div`
    position: relative;
    & > * { position: relative; z-index: 1; }
    &:before{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        opacity: ${props=>typeof props.opacity === 'number' ?props.opacity: 1 };
        z-index: ${props=>props.zIndex?props.zIndex:0};   
        animation: ${props=>props.animation};
        background-image: url(${props=>props.src});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
`;

const ChildContainer = styled.div`
    position: relative;
`;

const Container = styled.div`
    position: relative;
    display: flex;
    overflow: hidden;  
    backgroundSize: cover;
    backgroundPosition: center;
    backgroundRepeat: no-repeat;
    width: ${props=>props.width?props.width:'auto'};
    height: ${props=>props.height?props.height:'auto'};
    background-image: url(${props=>props.backgroundImage?props.backgroundImage:''});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    &:before{
        content: "";
        position: absolute;
        z-index:-1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        opacity: ${props=>typeof props.opacity === 'number' ?props.opacity: 1 };
        background-image: url(${props=>props.img?props.img:''});
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
    }

    &:after{
        -webkit-backdrop-filter: blur(5px); /* Use for Safari 9+, Edge 17+ (not a mistake) and iOS Safari 9.2+ */
        backdrop-filter: blur(20px); /* Supported in Chrome 76 */
        content: "";
        display: block;
        position: absolute;
        width: 100%; height: 100%;
    }
`;

const AnimatedImg = styled.img`
    z-index: 1;
    position: relative;
    opacity: ${props=>typeof props.imgOpacity === "number"?props.imgOpacity:1};
    transitionProperty: opacity;
    transition-duration: ${props=>props.transitionDuration?props.transitionDuration + 'ms':''};
    transition-timing-function: ${props=>props.transitionTimingFunction?props.transitionTimingFunction:''};
`;

export { fadeInAnimation, BackgroundImgAnimatedDiv, Container , ChildContainer, AnimatedImg };