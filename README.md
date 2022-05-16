# pyodide-worker

A demo of how to use pyodide in a web worker


```js
import * as pyworker from './index.js';

pyworker.start();
const result = await pyworker.call('test');
console.log(result);
```

## Loading Progress

```js
import * as pyworker from './index.js';

let ready = false;
pyworker.start();

const waitForLoad async () = > {
   const s = await pyworker.status();
   if( s === 'loading') {
     setTimeout(waitForLoad, 100);
   } else if (s === 'loaded') {
      ready = true;
   } else if (s === 'failed') {
      throw new Error('Pyodide failed to load');
   }
}

setTimeout(waitForLoad, 100);
```
