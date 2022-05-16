importScripts('https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js');

let pyodide = null;
// make fake function to start with
const pymod = {
    pycall: x => { return null },
    pyodideLoaded: 'loading',
};

onmessage = (e) => {
    const data = e.data;
    const mtype = data[0];
    const mid = data[1];
    let result = '';
    if (mtype === 'loading-status') {
        result = { pyodide: pymod.pyodideLoaded };
    } else if (mtype === 'call') {
        result = pymod.call(data[2]);
    }
    postMessage([mtype, mid, result]);
}

loadPyodide().then((pyodide) => {
    pymod.pyodideLoaded = 'loaded';
    pyodide.loadPackage('micropip').then(() => {
        pyodide.runPythonAsync(`
            import micropip
            # await micropip.install('PACKAGES?')
            def demo(x):
              print("hello world");
              return x
        `, (err) => {
            pymod.pyodideLoaded = 'failed';
        }).then(() => {
            const call = pyodide.globals.get('demo');
            pymod.pycall = (x) => {
                try {
                    let result = call(x);
                    return result;
                } catch (e) {
                    console.log(e);
                    return null;
                }
            };
        });
    }, (err) => {
        pymod.selfiesLoaded = 'failed';
    })
});
