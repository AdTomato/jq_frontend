

const enableProxy = process.env.NODE_ENV === 'debug';

let env = (window as any).config;


if (enableProxy) {
  env = Object.assign({}, env, {
    enableProxy,
    client_id: process.env.VUE_APP_OAUTH_CLINET_ID,
    secret: process.env.VUE_APP_OAUTH_SECRET,
    redirectHost: process.env.VUE_APP_OAUTH_REDIRECT,
    oauthHost: process.env.VUE_APP_OAUTH_HOST,
    apiHost: process.env.VUE_APP_API,
    scope: process.env.VUE_APP_OAUTH_SCOPE,
    portalHost: process.env.VUE_APP_PORTAL_HOST,
    /* 兼容之前的配置，如果未配置 VUE_APP_ADMIN_HOST 变量 则使用 VUE_APP_PORTAL_HOST */
    adminHost: process.env.VUE_APP_ADMIN_HOST || process.env.VUE_APP_PORTAL_HOST,
  });

  (window as any).config = env;
}

export default env;
