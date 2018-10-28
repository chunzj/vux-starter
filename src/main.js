// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import { debounce } from 'lodash';

import App from './App';
import router from './scripts/router';
import './scripts/api';

import './styles/main.styl';

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
}).$mount('#app-box');

(() => {
  const doc = window.document;
  let first = true;
  const adjustBase = () => {
    let { clientWidth } = doc.body;
    if (first && !/mobile/i.test(navigator.userAgent)) {
      // 如果页面有纵向滚动条，会占去clientWidth的空间，极端情况下会导致页面布局混乱，故减去滚动条宽度 15
      clientWidth -= 15;
      first = false;
    }
    doc.querySelector('html').style['font-size'] = `${Math.min(100, clientWidth / 10)}px`;
  };
  adjustBase();
  window.onresize = debounce(adjustBase, 150);

  // 1px检测
  if (window.devicePixelRatio && devicePixelRatio >= 2) {
    const testElem = doc.createElement('div');
    testElem.style.border = '.5px solid transparent';
    doc.body.appendChild(testElem);
    if (testElem.offsetHeight === 1) {
      doc.querySelector('html').classList.add('hairline');
    }
    doc.body.removeChild(testElem);
  }
})();
