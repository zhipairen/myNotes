/**
 * Created by gbl17 on 2017/6/22.
 */
//断言
const assert = require('assert');
function sayHello(name, callback) {
  let error = false;
  let str = "hello" + name;
  callback(error, str)
}
sayHello('world', function (error, value) {
  assert.ifError(err);
});