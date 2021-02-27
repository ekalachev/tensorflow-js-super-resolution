import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// import { WorkerManager, WorkerClient } from 'angular-web-worker/angular';
// import { SuperResolutionWorker } from './workers/super-resolution.worker';

import * as tf from '@tensorflow/tfjs';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videoElement', { read: ElementRef, static: false })
  videoElement: ElementRef;

  @ViewChild('canvas1src', { read: ElementRef, static: false })
  canvas1src: ElementRef;

  @ViewChild('canvas2src', { read: ElementRef, static: false })
  canvas2src: ElementRef;

  @ViewChild('counter', { read: ElementRef, static: false })
  counter: ElementRef;

  // private worker: WorkerClient<SuperResolutionWorker>;
  private worker: Worker;

  stream: MediaStream;
  counterNum: number = 0;

  canvas1: OffscreenCanvas;
  canvas2: OffscreenCanvas;

  grayscale: ImageData;

  constructor(
    // private workerManager: WorkerManager
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.canvas2 = new OffscreenCanvas(640, 480);

    // init video
    this.getUserMedia().then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      // this.process();
      const track = stream.getVideoTracks();
      
      const imageCapture = new ImageCapture(track[0]);

      setInterval(() => {
        imageCapture.grabFrame().then(imageBitmap => {
          this.worker.postMessage({ imageBitmap }, [imageBitmap]);
        });
      }, 100);
    });

    // init worker
    this.worker = new Worker("./workers/super-resolution.worker", { type: `module` });
    this.worker.onmessage = (e) => this.doWorkerMessage(e);

    // init main canvas
    this.canvas1 = this.canvas1src.nativeElement.transferControlToOffscreen();
    this.canvas2 = this.canvas2src.nativeElement.transferControlToOffscreen();

    this.worker.postMessage({
      offscreen1: this.canvas1,
      offscreen2: this.canvas2
    }, [this.canvas1, this.canvas2]);

    // const image = new Image();
    // image.src = './assets/images/bug128.jpg';
    // image.onload = () => {
    //     this.worker.postMessage({ img: image })
    // }

    // setTimeout(async () => {
    //   await this.detectFrame();
    // }, 1000);
  }

  private doWorkerMessage(e): void {
    this.grayscale = new ImageData(new Uint8ClampedArray(e.data), 640, 480);
    this.process();
  }

  private process(): void {
    const ctx = this.canvas2.getContext('2d');
    ctx.drawImage(this.videoElement.nativeElement, 0, 0);
    const pixels = ctx.getImageData(0, 0, 640, 480);
    this.worker.postMessage(pixels.data.buffer, [pixels.data.buffer]);
  }

  ngOnInit() {
    // if (this.workerManager.isBrowserCompatible) {
    //   this.worker = this.workerManager.createClient(SuperResolutionWorker);
    // } else {
    //   // if code won't block UI else implement other fallback behaviour
    //   this.worker = this.workerManager.createClient(SuperResolutionWorker, true);
    // }

    // await this.worker.connect();

    // const stream = await this.getUserMedia();

    // this.videoElement.nativeElement.srcObject = stream;

    // const canvasLr = this.videoLrCanvas.nativeElement.getContext('2d');

    // const self = this;

    // this.videoElement.nativeElement.addEventListener('loadedmetadata', function() {
    //   self.videoLrCanvas.nativeElement.width = 96;
    //   self.videoLrCanvas.nativeElement.height = 96;
    // });

    // setTimeout(async () => {
    //   await this.detectFrame();
    // }, 1000);
  }

  async detectFrame() {
    // tf.engine().startScope();

    // const lr = tf.browser.fromPixels(this.imgLr.nativeElement, 3).arraySync();

    // const sr = await this.worker.call(w => w.doWork({ canvas: this.canvas1 })) as number[][][];

    // tf.browser.toPixels(sr, this.videoSrCanvas.nativeElement);

    // console.log(tf.memory().numTensors);

    // tf.engine().endScope();

    // const ctx = this.canvas1src.nativeElement.getContext('2d');
    // ctx.drawImage(this.videoElement.nativeElement, 0, 0);

    this.counterNum++;
    this.counter.nativeElement.innerHTML = this.counterNum;

    requestAnimationFrame(() => {
      this.detectFrame();
    });
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
