## 介绍

为实现组织结构图，参考实现了一个简易版组织结构图，组件依赖于[vue-org-tree](https://github.com/hukaibaihu/vue-org-tree)，
在此基础上将部分源代码进行优化修改，并将labelWidth更改成labelStyle以便暴露给外部全量的修改label样式。并附上使用测试案例和开发文档。

## 安装

### CDN 安装

通过[unpkg.com/bin-tree-org](https://unpkg.com/bin-tree-org/) 可以看到最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 和 css
文件即可开始使用：

```
<!-- import Vue.js -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<!-- import bin-tree-org -->
<link href="https://unpkg.com/bin-tree-org@1.0.0/lib/style/style.css">
<script src="https://unpkg.com/bin-tree-org@1.0.0/lib/index.min.js"></script>
```
    
`@1.0.0` 表示版本号，我们建议锁定版本号来保证代码的稳定性

### npm 安装

推荐使用npm安装，它能更好地和[webpack](https://webpack.js.org/)打包工具配合使用。而且可以更好的和
es6配合使用。并且支持按需引入

```shell
npm i bin-tree-org -S
# or 
yarn add bin-tree-org
```

如果您了解node.js、npm安装，并希望配合webpack使用，请阅读下一节：[快速上手](/#/start)。

### 引入

在 main.js 中写入以下内容：

```javascript
import Vue from 'vue'
import BinTreeOrg from 'bin-tree-org'

Vue.use(BinTreeOrg)
```

### 最新版本

[![NPM version](https://img.shields.io/npm/v/bin-tree-org.svg)](https://www.npmjs.com/package/bin-tree-org)

### 相关链接

[bin-ui](https://wangbin3162.github.io/docs/bin-ui/)

