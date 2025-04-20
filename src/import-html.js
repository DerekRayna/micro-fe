import { fetchResource } from "./fetch-resource";

export const importHtml = async (url) => {
  const html = await fetchResource(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script"); // 获取所有的script节点
  
  // 获取所有的script中对应的js代码
  const getExternalScripts = () => {
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttrbute("src");
        // 如果没有src属性，读取script标签中包含的js
        if (!src) {
          return Promise.resolve(script.innerHTML);
        } else {
          // 如果有src属性，请求得到js代码
          return fetchResource(src.startsWith("http") ? src : `${url}${src}`);
        }
      })
    );
  };

  // 获取并执行所有的script脚本代码
  const execScripts = async () => {
    const scripts = await getExternalScripts();

    // 手动的构造一个commonjs模块环境，在加载使用UMD格式打包的子应用js代码是，会被复制
    const module = { exports: {}};
    const exports = module.exports;

    // 执行获取到的js代码
    scripts.forEach(code => {
      eval(code);
    });

    return module.exports;

  };

  return {
    template,
    getExternalScripts,
    execScripts,
  }
};
