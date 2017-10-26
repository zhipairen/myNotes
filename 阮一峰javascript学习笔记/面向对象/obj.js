/**
 * Created by gbl17 on 2017/6/14.
 */
// 1、构造函数的继承
function Super() {
  this.name = `父类`;
}
Super.prototype.say = function () {
  console.log('说话要经过我的同意')
};

function Sub() {
  Super.call(this);//子对象继承父类的所有属性
  this.subName = `子类`;
}
Sub.prototype = Object.create(Super.prototype);
//通过Object.create,而不是直接Super.prototype赋值给子类原型的好处是：防止对Sub.prototype的操作直接修改掉Super.prototype
// Sub.prototype = new Super();子类会继承父类实例的方法,不推荐;
Sub.prototype.constructor = Sub;//将实例的第一级原型指向Sub
//单个方法的继承
Sub.prototype.print = () =>{
  Super.prototype.print.call(this);
};

// 2、多重继承
function M1() {
  this.hello = 'hello'
}
function M2() {
  this.world = 'world'
}
function S() {
  M1.call(this);
  M2.call(this);
}
S.prototype = M1.prototype;
let s = new S();

// 3、模块
// 封装私有变量: 构造函数的写法
function StringBuilder() {
  this._buffer = []
}
StringBuilder.prototype = {
  constructor: StringBuilder,
  add: function (str) {
    this._buffer.push(str);
  },
  toString: function () {
    return this._buffer.join('');
  }
};// 缺点:私有变量_buffer可以从外部读写

//封装私有变量：立即执行函数IIFE写法
// 好处:利用函数作用域,闭包的方式,防止暴露私有目标
const module = (function (w) {
let count = 0;
let add = () =>{
  count ++ ;
};
return {
  add
}
})(window);
// es6模块：export导出,import导入
// moduleA.js
const ModuleA = '我是A模块';
function sayA() {
  alert(`hello everyone!${ModuleA}`)
}
class ModA{
  // ....
}
// 导出列表及可以重命名
export {
  ModuleA as Name,
  sayA,
  ModA
}
// 默认导出
export default {
  // 任何值
}
// world-foods.js - 来自世界各地的好东西
// 导入"sri-lanka"并将它导出的内容的一部分重新导出(将内容聚合在一起导出，不能操作Tea之类的导入)
export {Tea, Cinnamon} from "sri-lanka";
// moduleB.js  导入A模块
// import{Name, sayA} from 'module.js'
// 默认导入 import `自己起个名字` from 'module.js'
// 导出全部 import * as '自己起个名字' from 'module.js'