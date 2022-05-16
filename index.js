let worker = null;
const resolvers = {};
let id = 0;
const MAX_ID = 2 ** 10

const start = () => {
    if (worker !== null)
        return;
    const worker_url = new URL("./worker.js", import.meta.url);
    worker = new Worker(worker_url);
    worker.onmessage = (e) => {
        const data = e.data;
        const mid = data[1];
        const result = data[2];
        resolvers[mid](result);
        delete resolvers[mid];
    }
}

const status = () => {
    if (selfieWorker === null) {
        return new Promise(resolve =>
            resolve({
                pyodide: 'waiting',
            }));
    }
    id = (id + 1) % MAX_ID;
    worker.postMessage(['loading-status', id, null]);
    return new Promise(resolve => resolvers[id] = resolve);
}

const call = (s) => {
    if (worker === null) {
        return new Promise((resolve, reject) =>
            reject(new Error('Must call start() first')));
    }
    id = (id + 1) % MAX_ID;
    worker.postMessage(['call', id, s]);
    return new Promise(resolve => resolvers[id] = resolve);
}

const pyworker = {
    status,
    start,
    call
};

export default pyworker;

