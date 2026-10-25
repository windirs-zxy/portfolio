# 个人作品集 · 张潇阳

一个不需要任何构建工具的单文件作品集站点：双击 `index.html` 就能看，推到 GitHub Pages 就能访问。没有框架、没有依赖、不加载任何外部资源，断网也能完整打开。

## 在线地址

https://windirs-zxy.github.io/portfolio/

> 首次部署后可能需要一两分钟才生效。

## 本地预览

直接用浏览器打开 `index.html` 即可。不采集数据、不上传任何内容、不请求远程资源。

改完数据想检查有没有写错，跑一遍校验：

```bash
node check.js
```

需要 Node.js。脚本会做这几件事：JS 语法检查、分类与作品的对应关系检查、必填字段完整性检查、`workflow` 是否为空、`cover` 指向的封面文件是否真实存在、以及有没有意外的外部链接或联网调用。

## 目录结构

```
portfolio/
├── index.html      站点本体：样式 + 数据 + 渲染逻辑都在这个文件里
├── check.js        数据校验脚本（node check.js）
├── images/         作品封面与头像
└── 使用说明.md      更详细的数据字段说明
```

## 怎么加作品

打开 `index.html`，找到 `var WORKS = [`，复制一段对象改内容。字段含义：

- `cat` 分类 id，必须是 `CATEGORIES` 里已有的 id
- `title` 作品名
- `year` 制作时间，写 `2026.10` 或 `2026.09–10` 这种格式
- `role` 你负责的环节
- `summary` 一两句话，说清「做了什么、解决了什么」，别写成「参与了某项目」
- `workflow` 工作流步骤，页面上会渲染成带编号的流程
- `tags` 标签，用于搜索与展示
- `cover` 封面图路径，例 `images/daibi-cover.jpg`
- `link` 外部链接，可留空
- `sample` 版式示例标记，真实作品不要带这个字段

## 关于示例条目

`WORKS` 里带 `sample: true` 的条目是版式示例，页面上会显示红色「示例」徽章。**它们不是真实作品**，上线前请逐条替换成真实内容或删除。

判断标准很简单：如果把 `sample: true` 删掉之后你会心虚，那就还不能删。

## 部署到 GitHub Pages

1. 推送代码到 `main` 分支
2. 仓库 **Settings → Pages → Source** 选 `Deploy from a branch`
3. 分支选 `main`，目录选 `/ (root)`，保存
4. 等一两分钟，访问 `https://windirs-zxy.github.io/portfolio/`

## 不适合放进这个仓库的东西

- 商业字体（仿宋_GB2312、方正小标宋、楷体_GB2312 等），公开仓库等于分发盗版
- 含真人面孔的活动照片
- 含真实姓名、班级、手机号、学号的材料
- 校园题库相关的工具与数据
- 大体积源文件（`.blend1`、Ren'Py 的 `saves/` 与音频）

作品源码请放各自的独立仓库，这个仓库只负责展示与链接。
