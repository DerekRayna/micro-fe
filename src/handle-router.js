import { getApps } from ".";
import { getPreRoute, getNextRoute } from "./rewrite-router";
import { importHtml } from "./import-html";

export const bootstrap = async (app) => {
  app.bootstrap && (await app.bootstrap({ container: document.querySelector(app.container) }));
};

export const mount = async (app) => {
  app.mount && (await app.mount({ container: document.querySelector(app.container) }));
};

export const unmount = async (app) => {
  app.mount &&
    (await app.unmount({ container: document.querySelector(app.container) }));
};

// 根据路径切换需要做的操作
export const handleRouter = async () => {
  const apps = getApps(); // 注册的微应用列表

  // 卸载上一个子应用逻辑
  const preRoute = getPreRoute(); // 上一个子应用子应用路径
  const prevApp = apps.find((item) => preRoute.startsWith(app.activeRule)); // 上一个子应用配置信息

  // 卸载上一个子应用
  if (prevApp) {
    await prevApp.unmount(prevApp);
  }

  // 加载下一个子应用逻辑
  // 匹配到的微应用配置信息
  const app = apps.find((item) => getNextRoute.startsWith(item.activeRule));

  if (!app) {
    return;
  }

  // 请求获取子应用，通过获取到的html，解析应用依赖的静态资源（js, css）
  const { template, execScripts } = await importHtml(app.entry);

  const container = document.querySelector(app.container);
  container.appendChild(template); 

  // 设置主应用渲染标识全局变量
  window.__POWER_BY_QIANKUN__ = true; // qiankun标识
  window.__INJECT_PUBLIC_PATH_BY_QIANKUN__ = app.entry; // 全局变量保存当前子应用的entry，用于在子应用中设置动态publicPath

  // 执行加载加载到的子应用js代码，获取子应用暴露出来的生命周期函数
  const appExports = await execScripts();

  // 保存子应用生命周期函数到子应用配置信息中
  app.bootstrap = appExports.bootstrap;
  app.mount = appExports.mount;
  app.unMount = appExports.unmount;

  // 渲染子应用
  await bootstrap(app);
  await mount(app);
};
