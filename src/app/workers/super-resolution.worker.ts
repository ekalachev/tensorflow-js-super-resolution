/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import { DepthToSpace } from './../TensorFlowOpLayer';

let canvas1;
let canvas2;
let context1;
let context2;
let model;

addEventListener('message', ({ data }) => {
    // const response = `worker response to ${data}`;
    // postMessage(response);

    if (data.offscreen1 && data.offscreen2) {
        canvas1 = data.offscreen1;
        canvas2 = data.offscreen2;
        context1 = canvas1.getContext('2d');
        context2 = canvas2.getContext('2d');

        tf.serialization.SerializationMap.register(DepthToSpace);
        model = tf.loadLayersModel('/assets/fast_srgan/model.json');
    } else if (data.imageBitmap && context1 && context2) {
        context1.drawImage(data.imageBitmap, 0, 0);
        context2.drawImage(data.imageBitmap, 0, 0);
        // do something with frame

        // tf.engine().startScope();

        // const img = tf.image.convert_to_tensor(image, dtype=tf.float32);

        // let imgLr = tf.div(img, 255);
        // imgLr = tf.expandDims(imgLr, 0);

        // let sr = model.predict(imgLr) as tf.Tensor;

        // const srArr = (tf.mul(tf.div(tf.add(sr, 1), 2), 255).array())[0] as number[][][];

        // tf.engine().endScope();

        // context.drawImage(srArr, 0, 0);

        // return srArr;
    }
});
