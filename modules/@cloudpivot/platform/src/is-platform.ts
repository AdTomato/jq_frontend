

export const IS_DEBUG = process.env.NODE_ENV === 'debug';

export const IS_DINGTALK = /DingTalk/.test(navigator.userAgent);

export const IS_IOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否ios终端

export const IS_IE = /Trident/.test(navigator.userAgent);  //是否是IE
