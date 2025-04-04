---
title: 使用Astro搭建博客
excerpt: 简单记录Astro的部署
categories:
  - 计算机
tags:
  - 博客
cover: http://www.98qy.com/sjbz/api.php
status: 未完成
date: 2025-04-03 11:40
updated: 2025-04-04 16:26
---
**参考文章**
官方网站 [Astro](https://astro.build/)
指南：[为什么是 Astro? | Docs](https://docs.astro.build/zh-cn/concepts/why-astro/)
[新一代静态博客框架Astro的部署优化指南与使用体验 - 时歌的博客](https://www.lapis.cafe/posts/technicaltutorials/%E6%96%B0%E4%B8%80%E4%BB%A3%E9%9D%99%E6%80%81%E5%8D%9A%E5%AE%A2%E6%A1%86%E6%9E%B6astro%E7%9A%84%E9%83%A8%E7%BD%B2%E4%BC%98%E5%8C%96%E6%8C%87%E5%8D%97%E4%B8%8E%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C/#1%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C)

## 为什么选择 Astro
**Astro** 是一个现代化的静态站点生成框架，其核心目标是帮助开发者创建 **快速、轻量、且以内容为核心** 的网站。它于 2021 年首次发布，由于其独特的设计理念和对性能的极致追求，迅速在开发者社区中崭露头角。

   
### 推荐什么人适合 Astro
1. 想亲手打造独具一格的博客
2. 对编程有耐心
3. 能读懂官方文档并原因钻研

## 本章目标
1. 本地部署 Astro
2. 部署到 Vercel 或 GitHub Pages
3. 配置主题



## 所需环境
- node >= 18.14.1
- 文本编辑器(VsCode)
  
## 部署基础模板
在 Git 中使用命令部署 astro 
```npm
npm create astro@latest
```
第一个选项是命名，可以自己更改
第二个选项是我们选择使用 blog 模板
第三个我们选择 yes，安装所需依赖
第四个选项 git 仓库初始化，可以先不选

![[使用Astro搭建博客-202504031206.png|500]]
## 使用主题模板部署 Astro 博客
如果你不想使用 astro 的模板，GitHub 有许多开发者提供的模板

这里我选择的是 [Fuwari.](https://github.com/saicaca/fuwari)。这个模板真的很好看！
首先我们先去 fork 或拉取这个仓库
clone 到本地后依次执行以下命令
```shell
# 如果你尚未安装pnpm，执行如下命令
npm install -g pnpm

# 执行下面两个，安装依赖
pnpm install
pnpm add sharp
```

> PS：如果你 pnpm install 失败，可能是`.pnpm - store` 目录的权限不允许用户进行读写操作，去把对应的. pnpm-store 文件夹=>属性，将权限全开即可
>  

![[使用Astro搭建博客-202504031552.png|575]]

安装好所需依赖后，在终端执行 `npm run dev` 即可本地构建运行

### 基础配置
在 `src/config.ts` 进行站点配置

### 关于页面
在 `src\content\spec\about.md` 进行配置
### 创建页面
不想配图... 参考别人的叭
**参考文章**
- [给你的Fuwari添加一个友链页面 - AULyPc](https://blog.aulypc0x0.online/posts/add_friendspage_in_fuwari/)
### 部署到 Vercel
进入 vercel，在Vercel里选择import from GitHub，然后选择你的项目，直接部署即可

### 日期修改
我 Obsidian使用的日期是 date, 但是主题用的是 published，得替换一下
修改 `src\content\config.ts`
```ts
import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string(),
			date: z.coerce.date().optional(), // 兼容Obsidian date 字段
			published: z.coerce.date().optional(), 
			updated: z.coerce.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			tags: z.array(z.string()).optional().default([]),
			category: z.string().optional().default(""),
			lang: z.string().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.transform((data) => {
			// 自动将 date 赋值给 published（如果 published 不存在）
			return {
				...data,
				published: data.published ?? data.date, // 使用 ?? 避免 falsy 值问题
			};
		}),
});

export const collections = {
	posts: postsCollection,
};

```


### 修改底部信息
在 `src\components\Footer.astro`，我们可以看到底部信息并进行编辑。这里我用的是不蒜子加上日期计数器
```html
<div class="framework-info">
            Powered by: 🪐 <a href="https://astro.build/">Astro</a> + <a href="https://github.com/saicaca/fuwari">Fuwari</a>✨
            <br>
            <!--不蒜子计数器-->
            <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
            <!--添加一个访问量-->
            <span>本"<span style=" color: hsl(192 98% 55%); font-weight: bold; ">页面</span>"访问 <span id="busuanzi_value_page_pv" style=" color: hsl(192 98% 55%); font-weight: bold; "></span> 次 | 👀总访问 <span id="busuanzi_value_site_pv" style=" color: hsl(192 98% 55%); font-weight: bold; "></span> 次 | 总访客 <span id="busuanzi_value_site_uv" style=" color: hsl(192 98% 55%); font-weight: bold; "></span> 人</span>
            <br>
             <!--运行时间 -->
            <script type="text/javascript">function runtime(){const t=new Date("09/01/2024 08:00:00"),n=new Date,s=n-t,e=Math.floor(s/1e3),o=Math.floor(e/86400),i=Math.floor(e%86400/3600),a=Math.floor(e%3600/60),r=e%60;document.getElementById("runningtime").innerHTML=`⏱️本站已运行: ${o}天${i}小时${a}分${r}秒 ☁️`}setInterval(runtime,1e3)</script>
            <div class="transition text-50 text-sm text-center hidden md:block"><p id="runningtime"> </p></div>
          </div>
```

### 自定义字体
我们可以根据官方文档[使用自定义字体 | Docs](https://docs.astro.build/zh-cn/guides/fonts/) 进行本地安装，更加具体地请参照这篇文章[在Fuwari使用自定义字体 - AULyPc](https://blog.aulypc0x0.online/posts/use_custom_fonts_in_fuwari/)

这里我选择取巧进行外部文件注入
在 `src\components\Navbar.astro` 的末尾或合适位置注入你想使用的字体资源，以落霞孤鹜为例
```html
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/style.min.css" />
      <style>
        body {
          /* 屏幕优化版 */
          font-family: "LXGW WenKai Screen", sans-serif;
        }
      </style>
```

然后保存，就能看见站点字体已发生改变
