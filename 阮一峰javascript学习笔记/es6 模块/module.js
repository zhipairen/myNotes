/**
 * Created by gbl17 on 2017/6/14.
 */
/*
js引擎运行一个模块时的四个基本步骤:
    1、语法解析：阅读模块源代码，检查语法错误。
    2、加载：递归地加载所有被导入的模块。这也正是没被标准化的部分。
    3、连接：每遇到一个新加载的模块，为其创建作用域并将模块内声明的所有绑定填充到该作用域中，其中包括由其它模块导入的内容。
    如果你的代码中有import {cake} from "paleo"这样的语句，而此时“paleo”模块并没有导出任何“cake”,你就会触发一个错误。这实在是太糟糕了，你都快要运行模块中的代码了，都是cake惹的祸！
    4、运行时：最终，在每一个新加载的模块体内执行所有语句。此时，导入的过程就已经结束了，所以当执行到达有一行import声明的代码的时候……什么都没发生！*/
// 在编译时计算所有依赖并将所有模块打包成一个文件,通过网络一次传输所有模块；封包(bundle)
// es6的模块系统是静态的
//不定参数 ...arg(为数组类型)
function containsAll(haystack, ...needles) {
  console.log(`不定参数:${needles}`);
  for(let needle of needles){
    if(haystack.indexOf(needle) === -1){
      return false;
    }
  }
  return true;
}
// containsAll('banner','n','ner','an');
containsAll('banner');
function animalSentenceFancy(animals2="tigers",
                             animals3=(animals2 === "bears") ? "sealions" : "bears")
{
  console.log(`Lions and ${animals2} and ${animals3}! Oh my!`);
}
animalSentenceFancy();
animalSentenceFancy('bears');
animalSentenceFancy('ssss');

// symbol 是程序创建并且可以用作属性键的值,它能避免命名冲突的风险
const mySymbol = Symbol('mySymbol');
const mySymbol2 = Symbol.for('mySymbol');
const mySymbol3 = Symbol.for('mySymbol');
console.log('symbol的唯一性', mySymbol === mySymbol2);
console.log('Symbol.for',mySymbol3 === mySymbol2);
// console.log('Symbol2',mySymbol.toString());
let obj = {
  'name2': 'name2'
};
obj[mySymbol] = 'mySymbol';
obj.name = 'name';
console.log('属性名',Object.keys(obj));
for(let key of Object.keys(obj)){
  console.log('字符串属性名',key)
}
for(let key2 of Object.getOwnPropertySymbols(obj)){
  console.log('symbol属性名',key2)
}
