import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WorkerModule } from 'angular-web-worker/angular';
import { SuperResolutionWorker } from './workers/super-resolution.worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WorkerModule.forWorkers([
      { worker: SuperResolutionWorker, initFn: () => new Worker('./workers/super-resolution.worker.ts', { type: 'module' }) },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
