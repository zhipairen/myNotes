/*
注意点：1、最好把await命令放在try...catch代码块中
        2、多个await命令后面的异步操作，若不存在继发关系，可并发执行：
        写法一：let [foo, bar] = await Promise.all([getFoo(), getBar()]);
        写法二：let fooPromise = getFoo();let barPromise = getBar();
                let foo = await fooPromise;let bar = await barPromise;
*/
const fn = async function () {
//继发关系
  const user = await getUser();
  const posts = await fetchPosts(user.id);
  return { user, posts };
};
fn().then(res => console.log(res)).catch(err => console.error(err));