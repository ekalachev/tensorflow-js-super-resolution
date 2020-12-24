import { createTestClient, WorkerTestingClient } from 'angular-web-worker/testing';
import { SuperResolutionWorker } from './super-resolution.worker';

describe('SuperResolutionWorker', () => {

    // decorated methods/properties should always be tested through the WorkerTestingClient to mock the serialization behaviour
    let client: WorkerTestingClient<SuperResolutionWorker>;

    beforeEach(() => {
        client = createTestClient(SuperResolutionWorker);
    });

    it('Some test', async () => {

        // this will call the onWorkerInit hook and allow the decorated methods/properties to be called/accessed through the client
        await client.connect();

        // get access to the underlying worker class
        // client.workerInstance
    });

});
