import { AngularWebWorker, bootstrapWorker, OnWorkerInit, Callable } from 'angular-web-worker';
import * as tf from '@tensorflow/tfjs';
import { DepthToSpace } from './../TensorFlowOpLayer';
import { ElementRef } from '@angular/core';

/// <reference lib="webworker" />

@AngularWebWorker()
export class SuperResolutionWorker implements OnWorkerInit {
    model: tf.LayersModel;

    constructor() { }

    async onWorkerInit() {
        tf.serialization.SerializationMap.register(DepthToSpace);

        this.model = await tf.loadLayersModel('/assets/fast_srgan/model.json');
    }

    @Callable()
    public async doWork(data): Promise<number[][][]> {

        var gl = data.canvas.getContext("webgl");

        return null;

        // tf.engine().startScope();

        // let imgLr = tf.div(img, 255);
        // imgLr = tf.expandDims(imgLr, 0);

        // let sr = this.model.predict(imgLr) as tf.Tensor;

        // const srArr = (await tf.mul(tf.div(tf.add(sr, 1), 2), 255).array())[0] as number[][][];

        // tf.engine().endScope();

        // return srArr;
    }

}
bootstrapWorker(SuperResolutionWorker);
