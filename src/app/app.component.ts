import { Component, ElementRef, ViewChild } from '@angular/core';
import { WorkerManager, WorkerClient } from 'angular-web-worker/angular';
import { SuperResolutionWorker } from './workers/super-resolution.worker';

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

  private worker: WorkerClient<SuperResolutionWorker>;

  // model: tf.LayersModel;
  prediction: any;
  counterNum: number = 0;

  constructor(private workerManager: WorkerManager) { }

  async ngOnInit(): Promise<void> {
    if (this.workerManager.isBrowserCompatible) {
      this.worker = this.workerManager.createClient(SuperResolutionWorker);
    } else {
      // if code won't block UI else implement other fallback behaviour
      this.worker = this.workerManager.createClient(SuperResolutionWorker, true);
    }

    // await this.loadModel();

    await this.worker.connect();

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
    tf.engine().startScope();

    const lr = tf.browser.fromPixels(this.imgLr.nativeElement, 3).arraySync();

    const sr = await this.worker.call(w => w.doWork(lr)) as number[][][];

    tf.browser.toPixels(sr, this.videoSrCanvas.nativeElement);

    // console.log(tf.memory().numTensors);

    tf.engine().endScope();

    this.counterNum++;
    this.counter.nativeElement.innerHTML = this.counterNum;

    requestAnimationFrame(() => {
      this.detectFrame();
    });
  }

  // async loadModel() {
  //   this.model = await tf.loadLayersModel('/assets/fast_srgan/model.json');

  //   // const inputs = tf.layers.input({shape: [128, 128, 3]});
  //   // const outputs = model.apply(inputs) as tf.SymbolicTensor;
  //   // this.model = tf.model({inputs: inputs, outputs: outputs});

  //   console.log("Model has benn loaded");
  // }


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
