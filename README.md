# ttni-web 1.0.5

get function name  from stacktrace

## NPM

```sh
npm install ttni-web
```
```
### JavaScript for web (with  "live-server") 

```js 
import { TTNI } from './node_modules/ttni/dist/index.js'

let ttni = new TTNI();
let ni = ttni.ni.bind(ttni);
let ne = ttni.ne.bind(ttni);


ttni.logs = { test0: true, test1: !true }
Object.assign(ttni, { bHtml: false, bShowTimer: true, bCaller: false, bTrace: true, logs: undefined, maxColorsLevel: 4 })

class Test2Class {
  test3() {
    ni()
    new Test1Class().test2();
    ne()
  }
  test4() {
    ni()
    this.test3();
    ne()
  }
  test5() {
    ni()
    this.test4();
    ne()
  }
}
class Test1Class {
  test1() {
    ni()
    ne()
  }
  test2() {
    ni()
    this.test1();
    ne()
  }

  //ttni.bLogsIgnore = !false;
}

function test3() {
  ni()
  new Test1Class().test2();
  ne()
}

function test4() {
  ni()
  test3();
  ne()
}

function test5() {
  ni()
  test4();
  ne()
}
const test1 = () => {
  ni()
  ne()
}
const test2 = () => {
  ni()
  test1();
  ne()
}

const p1 = new Test1Class();
//const p = new Test2Class();

function testExit(...nu) {
  ni(nu)
  ttni.shAt();

  //process.exit()

  ne()

}
testExit(['exit no', true]);
ttni.shTimer();
ttni.shStack();
```
# console.log:
```js

  ```
