importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.8.0/dist/tf.min.js");

let canvas;
let context;
let model;

onmessage = async (e) => {
  if (e.data.offscreen) {
    canvas = e.data.offscreen;
    context = canvas.getContext('2d');

    tf.serialization.SerializationMap.register(DepthToSpace);
    model = await tf.loadLayersModel('/assets/fast_srgan/model.json');
    
  } else if (e.data.imageBitmap && context) {
    context.drawImage(e.data.imageBitmap, 0, 0);
    // do something with frame
  }
}