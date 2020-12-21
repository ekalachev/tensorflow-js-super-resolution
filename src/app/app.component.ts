import { Component, ElementRef, ViewChild } from '@angular/core';
import { DepthToSpace } from './TensorFlowOpLayer';

import * as tf from '@tensorflow/tfjs';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('videoElement', { read: ElementRef, static: false })
  videoElement: ElementRef;
  @ViewChild('videoSrCanvas', { read: ElementRef, static: false })
  videoSrCanvas: ElementRef;
  @ViewChild('imgLr', { read: ElementRef, static: false })
  imgLr: ElementRef;
  @ViewChild('canvas', { read: ElementRef, static: false })
  canvas: ElementRef;
  @ViewChild('counter', { read: ElementRef, static: false })
  counter: ElementRef;

  stream: MediaStream;

  model: tf.LayersModel;
  prediction: any;
  counterNum: number = 0;

  async ngOnInit(): Promise<void> {
    tf.serialization.SerializationMap.register(DepthToSpace);

    await this.loadModel();

    // const stream = await this.getUserMedia();

    // this.videoElement.nativeElement.srcObject = stream;

    // const canvasLr = this.videoLrCanvas.nativeElement.getContext('2d');

    // const self = this;

    // this.videoElement.nativeElement.addEventListener('loadedmetadata', function() {
    //   self.videoLrCanvas.nativeElement.width = 96;
    //   self.videoLrCanvas.nativeElement.height = 96;
    // });

    setTimeout(async () => {
      await this.detectFrame();
    }, 1000);
  }

  async detectFrame() {
    // const canvasLr = this.videoLrCanvas.nativeElement.getContext('2d');

    // canvasLr.drawImage(this.videoElement.nativeElement, 0, 0, 96, 96);

    // await this.execute(this.videoLrCanvas.nativeElement, this.videoSrCanvas.nativeElement);

    tf.tidy(() => {

      let img = tf.browser.fromPixels(this.imgLr.nativeElement, 3);
      // img = tf.image.resizeNearestNeighbor(img, [96, 96]);
      img = tf.div(img, 255);
      img = tf.expandDims(img, 0);
      let sr = this.model.predict(img) as tf.Tensor;
      sr = tf.mul(tf.div(tf.add(sr, 1), 2), 255).arraySync()[0];

      tf.browser.toPixels(sr as tf.Tensor3D, this.videoSrCanvas.nativeElement);

      this.counterNum++;
      this.counter.nativeElement.innerHTML = this.counterNum;
    });

    requestAnimationFrame(() => {
      this.detectFrame();
    });
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/fast_srgan/model.json');

    // const inputs = tf.layers.input({shape: [128, 128, 3]});
    // const outputs = model.apply(inputs) as tf.SymbolicTensor;
    // this.model = tf.model({inputs: inputs, outputs: outputs});

    console.log("Model has benn loaded");
  }


  private async getUserMedia(): Promise<MediaStream> {
    try {
      return (
        this.stream ||
        (this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        }))
      );
    } catch (e) {
      return null;
    }
  }
}
