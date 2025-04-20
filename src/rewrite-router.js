import { handleRouter } from "./handle-router";

let preRoute = ""; // 需要卸载的子应用匹配路径;
let nextRoute = window.location.pathname; // 需要加载的子应用匹配路径

export const getPreRoute = () => preRoute; // 获取需要卸载的子应用匹配路径

export const getNextRoute = () => nextRoute; // 获取需要加载的子应用匹配路径

// 监听popState变化
export const rewriteRouter = () => {
  window.addEventListener("popstate", (e) => {
    preRoute = nextRoute; // 将上一个加载的子应用匹配路径赋值给需要卸载的子应用匹配路径
    nextRoute = window.location.pathname; // 将当前的路径赋值给需要加载的子应用匹配路径
    handleRouter();
  });

  // 重写pushState方法
  const rawPushState = window.history.pushState;
  window.history.rawPushState = (...args) => {
    preRoute = nextRoute; // 将上一个加载的子应用匹配路径赋值给需要卸载的子应用匹配路径
    rawPushState.call(window.history, args); // 路径切换
    nextRoute = window.location.pathname; // 路径切换后设置最新的路径给需要加载的子应用路径
    handleRouter();
  };

  // 重写replaceState方法
  const rawReplaceState = window.history.replaceState;
  window.history.replaceState = (...args) => {
    preRoute = nextRoute; // 将上一个加载的子应用匹配路径赋值给需要卸载的子应用匹配路径
    rawReplaceState.call(window.history, args); // 路径切换
    nextRoute = window.location.pathname; // 路径切换后设置最新的路径给需要加载的子应用路径
    handleRouter();
  };
};
