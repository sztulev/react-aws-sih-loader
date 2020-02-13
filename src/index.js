import { SIHImage, SIHLazyLoadImage , SIHBackgroundImage, SIHLazyLoadBackgroundImage } from './component/SIHImageLoader.jsx';
import { AWSSIHContext} from './component/AWSSIHConfig.jsx';

export { 
    SIHLazyLoadImage as AWSSIHLazyLoadImg, 
    SIHLazyLoadBackgroundImage as AWSSIHLazyLoadBackgroundImage, 
    SIHImage as AWSSIHImg, 
    SIHBackgroundImage as AWSSIHBackgroundImage,
    AWSSIHContext 
};