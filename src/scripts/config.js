const isDev = true; // 可根据域名来判断是否为开发或者正式环境

const ua = navigator.userAgent;
export const isWechat = /micromessenger/i.test(ua);
export const isIOS = /iphone|ipod|ipad/i.test(ua);

export const baseURL = isDev ? '开发地址' : '正式地址';

const env = {
  isApp: /ptys/i.test(ua),
  isMobile: /android|iphone|ipod|ipad/i.test(ua),
  isIOS: /iphone|ipod|ipad/i.test(ua),
  isAndroid: /android/i.test(ua),
  isWechat: /micromessenger/i.test(ua),
  isQQ: /qq\//i.test(ua),
  isWeibo: /weibo/i.test(ua),
  isDingTalk: /dingtalk/i.test(ua),
};
env.isBrowser = !(env.isApp || env.isWechat || env.isQQ || env.isWeibo || env.isDingTalk);

export default {
  isIOS,
  isWechat,
  baseURL,
  isDev,
  env,
};
