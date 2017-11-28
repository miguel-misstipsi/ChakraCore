//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

WScript.LoadScriptFile("..\\UnitTestFramework\\UnitTestFramework.js");

var tests = [
  {
    name: "calling Symbol.toPrimitive on Date prototype should not AV",
    body: function () {
         Date.prototype[Symbol.toPrimitive].call({},'strin' + 'g');
    }
  },
  {
    name: "updated stackTraceLimit should not fire re-entrancy assert",
    body: function () {
        Error.__defineGetter__('stackTraceLimit', function () { return 1;});
        assert.throws(()=> Array.prototype.map.call([]));
    }
  },
  {
    name: "Array.prototype.slice should not fire re-entrancy error when the species returns proxy",
    body: function () {
        let arr = [1, 2];
        arr.__proto__ = {
          constructor: {
            [Symbol.species]: function () {
              return new Proxy({}, {
                defineProperty(...args) {
                  return Reflect.defineProperty(...args);
                }
              });
            }
          }
        }
        Array.prototype.slice.call(arr);
    }
  },
  {
    name: "rest param under eval with arguments usage in the body should not fail assert",
    body: function () {
        f();
        function f() {
            eval("function bar(...x){arguments;}")
        }
    }
  },
  {
    name: "Token left after parsing lambda result to the syntax error",
    body: function () {
        assert.throws(()=> { eval('function foo ([ [] = () => { } = {a2:z2}]) { };'); });
    }
  },
];

testRunner.runTests(tests, { verbose: WScript.Arguments[0] != "summary" });
