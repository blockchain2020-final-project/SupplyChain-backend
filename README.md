# SupplyChain 后端

## 项目简介
该项目是我们小组实现的供应链系统的后端服务，这个项目使用了轻量级的 `koa2` 框架，同时基于 fisco-bcos 官方提供的 nodejs-sdk，实现了与链端的高效适配和调用，以及和前端的沟通。

## 部署方法
### 环境要求
- 操作系统：linux/macOS
- 链端：http://www.fisco-bcos.org/developer/docs/installation.html 依照这里搭建即可
- nodejs 环境:
  - node: v12.10.0 及以上
  - npm: 6.14.7

- redis 环境: 默认的 redis 配置是：
  - port: 6379
  - host: localhost
  您也可以修改源码来契合您的本地环境

### 配置方法
1. clone 本项目
```
git clone https://github.com/blockchain2020-final-project/SupplyChain-backend.git
```
2. 进入项目目录，安装依赖
```

cd SupplyChain-backend
npm install

cd src/packages/api/compile/compilers/solc-0.4/
npm install
cd -

cd src/packages/api/compile/compilers/solc-0.5/
npm install
cd -
```
3. 根据您的需求修改位于 `src/packages/cli/conf/config.json` 的配置文件


4. 运行本项目:
```
node src/index.js
```

