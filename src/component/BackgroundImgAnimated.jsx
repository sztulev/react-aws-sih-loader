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


export { fadeInAnimation };

export default BackgroundImgAnimatedDiv;