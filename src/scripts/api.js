import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';

import { toPairs, each, isArray } from 'lodash';
import { Toast } from 'vux';

import { baseURL } from './config';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = baseURL;

const CACHE = new Map();
const HEADER = { CACHE: 'X-Cache', QUIET: 'X-Quiet' };

axios.interceptors.request.use((config) => {
  if (config.data && !(config.data instanceof FormData)) {
    const formdata = new FormData(); // 使用FormData封装，配合后端koa-body
    toPairs(config.data).forEach(([key, value]) => {
      if (isArray(value)) {
        each(value, x => formdata.append(key, x));
      } else {
        formdata.append(key, value);
      }
    });
    config.data = formdata;
  }
  return config;
}, Promise.reject);

axios.interceptors.response.use((resp) => {
  const { code, data, msg } = resp.data;
  if (code === 200) { // 成功状态码
    if (resp.config.method === 'get') {
      const cacheId = resp.config.headers[HEADER.CACHE];
      if (cacheId) {
        CACHE.set(cacheId, data);
      }
    } else if (!resp.config.headers[HEADER.QUIET]) {
      Toast('操作成功');
    }
    return data;
  }
  Toast(msg);
  return Promise.reject(resp.data);
}, () => {
  Toast('服务异常，请稍后再试');
});

const parseReq = (path, method = 'get', params = {}) => {
  const headers = {};
  if (/^!/.test(path)) {
    if (method === 'get') {
      headers[HEADER.CACHE] = path + Qs.stringify(params);
    } else {
      headers[HEADER.QUIET] = false;
    }
  }
  return [path.replace(/^!/, ''), headers];
};

export const $get = (path, params = {}) => {
  const [url, headers] = parseReq(path, 'get', params);
  const cacheId = headers[HEADER.CACHE];
  if (cacheId && CACHE.has(cacheId)) {
    return Promise.resolve(CACHE.get(cacheId));
  }
  return axios({ url, params, headers });
};

export const $post = (path, data = {}) => {
  const [url, headers] = parseReq(path, 'post');
  return axios({
    url, data, method: 'post', headers,
  });
};

export const $put = (path, data = {}) => {
  const [url, headers] = parseReq(path, 'put');
  return axios({
    url, data, method: 'put', headers,
  });
};

export const $delete = (path, data = {}) => {
  const [url, headers] = parseReq(path, 'delete');
  return axios({
    url, data, method: 'delete', headers,
  });
};

Vue.use({
  install($Vue) {
    $Vue.prototype.$get = $get;
    $Vue.prototype.$post = $post;
    $Vue.prototype.$put = $put;
    $Vue.prototype.$delete = $delete;
  },
});
