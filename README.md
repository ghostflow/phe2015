# phe2015 前端文档说明


* 部署依赖
	* node
	* grunt
* 开发框架
	* bootstrap
	* backbone
* 语言模板
  	* handlebars
* 使用插件（目前）
	* jquery
	* seajs
* 开发依赖
	* sass

项目文件结构如下
	``

	├── /css (实时编译路径)
	├── /html(静态html)
	├── /image
	├── /js
	|   ├── /lib(库)
	|	├──	/src
	|		├── /collection
	|		├── /common
	|		├── /component
	|		├── /model
	|		├── /view
	|		├── /module
	├── /fonts
	├── sass

样式以bootstrap为基础，提供默认样式表及简单的响应式
js使用mvc框架，遵循cmd规范做模块化开发。目前已完成的注册登录逻辑在js/src/component/userInfo.js中。