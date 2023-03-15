function Koa() {
  // ...
  this.middleares = [];
}

Koa.prototype.use = function (middleare) {
  // 此时 middleare 其实就是 (ctx, next) => ()
  this.middleares.push(middleare); // 发布订阅，先收集中间件
  return this;
};
Koa.prototype.listen = function () {
  const fn = compose(this.middleares); // 组合中间件
};

// 核心函数
function compose(middleares) {
  let index = -1;

  // 准备递归
  function dispatch(i) {
    if (i <= index) throw new Error('next（） 不能调用多次');
    index = i; // i肯定大于index
    if (i === middleares.length) return; // 处理最后一个中间件
    const middleare = middleares[i]; // 别忘记中间件的格式 (ctx, next) => ()
    return middleare('ctx', dispatch.bind(null, i + 1)); // 每次调用next，都用调用一次dispatch方法，并且i+1
  }
  return dispatch(0);
}

const app = new Koa();

// 中间件1
app.use((ctx, next) => {
  console.log('1');
  next();
  console.log('2');
});
// 中间件2
app.use((ctx, next) => {
  console.log('3');
  next();
  next();
  console.log('4');
});
// 中间件3
app.use((ctx, next) => {
  console.log('5');
  next();
  console.log('6');
});

app.listen();
