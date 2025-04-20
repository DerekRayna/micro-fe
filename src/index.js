import { rewriteRouter } from "./rewrite-router";
import { handleRouter } from "./handle-router";

let _apps = [];

export const registerMicroApps = (apps) => {
    _apps = apps;
}

export const getApps = () => _apps;

export const start = () => {
    rewriteRouter(); // 监听路由变化，重新pushState/replaceState
    handleRouter(); // 初始化进入时根据路由匹配子应用
}