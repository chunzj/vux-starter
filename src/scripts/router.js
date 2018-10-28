import Vue from 'vue';
import Router from 'vue-router';
import { kebabCase } from 'lodash';

const routes = [{ path: '*', redirect: '/home' }]; // 指定首页
const views = require.context('@/views', true, /\.vue$/, 'lazy');
views.keys().reduce((res, key) => {
  const name = kebabCase((key.split('.'))[1]);

  // 详情页更改为动态路由匹配，例如: user-detail => user/:id/detail
  // 所以详情页面命名约定为XXXDetail
  let path = name;
  if (name.indexOf('detail') !== -1) {
    const arrs = name.split('-');
    arrs.splice(1, 0, ':id');
    path = arrs.join('/');
  }

  res.push({
    name,
    path: `/${path}`,
    component: () => views(key),
  });
  return res;
}, routes);

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes,
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
