/**
 * Created by gbl17 on 2017/6/15.
 */
process.stdin.setEncoding('utf8');
process.stdin.on('readable',function () {
  let chunk = process.stadin.read();
  if(chunk !== null){
    process.stdout.write('data:'+chunk)
  }
});
process.stdin.on('end',function () {
  process.stdout.write('end')
});
// process.argv属性返回一个数组，由命令行执行脚本时的各个参数组成。
// 它的第一个成员总是node，第二个成员是脚本文件名，其余成员是脚本文件的参数。
//