const { Worker } = require('worker_threads');
const path = require('path');

const runWorker = ({
                     filePath,
                     workerData,
                     errorHandler,
                     messageHandler,
                     exitHandler,
                   }) => {
  const worker = new Worker(filePath, {
    workerData,
  });

  worker.on('error', errorHandler);

  worker.on('message', messageHandler);

  worker.on('exit', exitHandler);

  process.on('exit', async () => {
    try {
      await worker.terminate();
    } catch (e) {
      // ignore e
    }
  });

  return worker;
};

runWorker({
  filePath: path.resolve(__dirname, './worker.js'),
  workerData: {},
  errorHandler: (e) => {
    console.log(e);
  },
  messageHandler: (msg) => {
    console.log(msg);
  },
  exitHandler: (code) => {
    if (code !== 0) {
      console.log(code);
    }
  },
});
