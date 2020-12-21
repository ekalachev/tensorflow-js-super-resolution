import * as tf from '@tensorflow/tfjs';

 export class DepthToSpace extends tf.layers.Layer {
    constructor() {
        super({});
    }

    computeOutputShape(shape: Array<number>) {
        return [null, ...shape.slice(1, 3).map(x => x * 2), 32];
    }

    call(input): tf.Tensor {
        const result = tf.depthToSpace(input[0], 2);
        return result;
    }

    static get className() {
        return 'TensorFlowOpLayer';
    }
}