/**
 * 中间件
 * */
const koa = require('koa');
const app = koa();

app.use(function* responserTime(next) {
  let start = new Date;
  yield next;
  let ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
app.listen(3000);