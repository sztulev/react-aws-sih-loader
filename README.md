# React Image Loader Component for AWS ServerlessImageHandler (SIH)

Small React / Next.js component to load amd lazy load large images from Amazon S3 via AWS ServerlessImageHandler.

See demos at https://react-aws-sih-loader-nextjs-demo.now.sh/.

Source code at https://github.com/sztulev/react-aws-sih-loader.

## Introduction
Amazon S3 may be one option to host large images of a Next.js website or React app. The AWS Serverless Image Handler (SIH) can come handy to dynamically transform those images and adjust their size and to significantly improve the perfomance of your website. This npmjs package exports several React component that can help you transforming and loading images from AWS SIH API. In order to use it, at the minimum, you will need a AWS Account and AWS SIH deployed. [Follow this link](https://aws.amazon.com/solutions/serverless-image-handler/) to find out more details on how to setup an AWS SIH solution.

## About AWS Serverless Image Handler
The AWS Serverless Image Handler automatically deploys and configures an AWS serverless architecture that uses Amazon S3 for storage, AWS Lambda and the open source image processing suite Sharp for image manipulation, and Amazon CloudFront for global content delivery. For more details on the AWS ServerlessImageHandler, see [AWS SIH Documentation](https://docs.aws.amazon.com/solutions/latest/serverless-image-handler/welcome.html)

## Installation

```bash
npm install --save react-aws-sih-loader@latest
```
or:
```bash
yarn add react-aws-sih-loader
```

**IMPORTANT**: Under the hood, it makes use of [hooks](https://reactjs.org/docs/hooks-intro.html), therefore, using it requires React `>= 16.8`.

## Usage

Use `AWSSIHImg` to resize and load a single image. The below example will resize the given image to width of 640px and displays it as an `<img>` tag.

```jsx static
import React from 'react';
import { AWSSIHImg as Img } from 'react-aws-sih-loader';

function MySIHImg() {
    return (
        <Img src="large-photo-01.JPG" 
            config={{
                endpoint: 'https://cxjchicdsxdfl3.cloudfront.net',
                bucket: 'bucket-for-my-images',
                width: 640, 
                normalize: true,
                resizeMode:'cover',
            }} />
    )
}
```

Use `AWSSIHLazyLoadImg` if you want display an image placeholder before the large image gets fully loaded. It wraps `<img>` in a `<div>` tag with a low-res image in the background while the large image is being transformed and loaded.
```jsx static
import React from 'react';
import { AWSSIHLazyLoadImg as Img } from 'react-aws-sih-loader';

function MySIHImg() {
    return (
        <Img src="large-photo-01.JPG" 
            config={{
                endpoint: 'https://cxjchicdsxdfl3.cloudfront.net',
                bucket: 'bucket-for-my-images',
                width: 640, 
                normalize: true
            }} />
    )
}
```

`AWSSIHBackgroundImage` and `AWSSIHLazyLoadBackgroundImage` can be used to add background images to content.
```jsx static
import React from 'react';
import { AWSSIHBackgroundImage as BckImg } from 'react-aws-sih-loader';

function MySIHImg() {
    return (
        <BckImg src="static/img/large-photo-02.JPG" 
            config={{
                endpoint: 'https://cxjchicdsxdfl3.cloudfront.net',
                bucket: 'bucket-for-my-images',
                width: 2048, 
                normalize: true
            }}>
            <p>Hello</p>
        </BckImg>
    )
}
```

`AWSSIHContext` component provides a common configuration option at any higher level. It uses React's Context in the background to pass down configuration items.

```jsx static
import React from 'react';
import { AWSSIHImg as Img, AWSSIHContext } from 'react-aws-sih-loader';

function MySIHImg() {
  return (
        <AWSSIHContext config={{
            endpoint: 'https://cxjchicdsxdfl3.cloudfront.net',
            bucket: 'bucket-for-my-images',
            width: 2048, 
            normalize: true
            }}>
            <ul>
                <li>
                    <Img src="static/img/large-photo-01.JPG" />
                </li>
                <li>
                    <Img src="static/img/large-photo-02.JPG" />
                </li>
                <li>
                    <Img src="static/img/large-photo-03.JPG" />
                <li>
            </ul>
        </AWSSIHContext>
  )
}

```
Furthermore, multiple `AWSSIHContext` components can be embedded down the chain, so configuration items can be added or overwritten at lower levels.
```jsx static
import React from 'react';
import { AWSSIHImg as Img, AWSSIHContext } from 'react-aws-sih-loader';

function MySIHImg() {
  return (
        <AWSSIHContext config={{
            endpoint: 'https://cxjchicdsxdfl3.cloudfront.net',
            }}>
            <div>
                <AWSSIHContext config={{
                    bucket: 'ultra-wide-images',
                    width: 2048
                    }}>
                    <Img src="static/img/large-photo-01.JPG" />
                    <Img src="static/img/large-photo-02.JPG" />
                </AWSSIHContext>
            </div>
            <div>
                <AWSSIHContext config={{
                    bucket: 'regular-images',
                    width: 640
                    }}>
                    <Img src="static/img/photo-03.JPG" />
                    <Img src="static/img/photo-04.JPG" />
                </AWSSIHContext>
            </div>
        </AWSSIHContext>
  )
}
```

## Configuration
The `config` property object can be applied on any component. `endpoint` and `bucket` values must be provided in the configuration chain.

* `endpoint` __required__ the CloudFront distribution endpoint created by AWS SIH
* `bucket` __required__ the Amazon S3 bucket to load the original image from
* `width` target width of the image after transformation
* `height` target height of the image after transformation (if none of width or height is provided, the image will be fetch in its original size),
* `resizeMode` 'cover', 'contain', 'fill, 'outside', 'inside' ([see Sharp docs](https://sharp.pixelplumbing.com/api-resize))
* `normalize` true or false, enhance output image contrast
* `grayscale` true or false, convert image to grayscale
* `previewWidth` width of the preview image when using lazy loading components 
* `previewHeight` default value: 50. height of the preview image when using lazy loading components 
* `previewResizeMode` same as `resizeMode`, but applied on the preview image when using lazy loading components 
* `previewGrayscale` true or false, convert the preview image to grayscale
* `transitionDuration` string value in the format of '_2s_' or '_3000ms_', default value is '_.5s_'.
* `transitionTimingFunction` value used for CSS transition-timing-function, default is 'linear'
* `debug` true or false, enable printing the API request onto the console.
