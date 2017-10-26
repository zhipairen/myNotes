/**
 * Created by gbl17 on 2017/6/14.
 */
// 生成器函数
function* quips(name) {
  yield "你好 " + name + "!";
  yield "希望你能喜欢这篇介绍ES6的译文";
  if (name.startsWith("X")) {
    yield "你的名字 " + name + "  首字母是X，这很酷！";
  }
  yield "我们下次再见！";
}
let guo = quips('过炳龙');
guo.next();