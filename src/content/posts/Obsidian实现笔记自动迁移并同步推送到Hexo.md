---
title: Obsidian实现笔记自动迁移并同步推送到Hexo
categories:
  - Obsidian
tags:
  - 笔记
  - 博客
  - 前端
status: 已完成
date: 2024-11-19 20:47
updated: 2025-04-04 19:22
slug: obsidianshi-xian-bi-ji-zi-dong-qian-yi-bing-tong-bu-tui-song-dao-hexo
cover: https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/%E8%83%8C%E8%BA%AB%E5%A6%B9%E5%A6%B9.jpg
---
编写了一个插件，将文件自动复制到 Hexo 的文件夹里，并自动 git push
<!--more-->
最近在玩 Hexo 博客，总感觉静态网页书写有点麻烦，因为我的笔记一般都是放到一起的，但是 Hexo 有自己的目录，在网上搜索了很久也没有合适的解决办法，就索性自己动手写一个插件了，好在不是很难，稍微有不熟悉的语法，问一下豆包也是解决了。
（话说豆包真厉害.... 帮我完善了好多）
话不多说，来看看怎么用的。点击即可，哈哈。
![插件按钮|322](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/%E6%8F%92%E4%BB%B6%E6%8C%89%E9%92%AE.png)

## 效果展示
![插件效果展示](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/%E6%8F%92%E4%BB%B6%E6%95%88%E6%9E%9C%E5%B1%95%E7%A4%BA.png)
## 插件设置
![插件设置](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/%E6%8F%92%E4%BB%B6%E8%AE%BE%E7%BD%AE.png)
源文件夹：就是自己存放博客的 Obsidian 位置了，写相对路径哈~没有加判断，相对路径已经够简单了。
目标文件夹：Hexo 本地仓库存放博客的所在位置
开启自动推送：开启后，会执行 git push 操作，如果分支不一样，可以自行更改

![push配置|500](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/push%E9%85%8D%E7%BD%AE.png)

git push 的相关代码如图所示，可自行更改。

### 额外说明
插件根据最后更新时间进行复制操作的，未修改的不会重复操作。
目前来看好像也没什么要更新的，除非遇到我不能使用的情况。可自行进行修改，我注释加了好多，应该有点基础的也能照着更改了。
更新：
2024-11-27：添加了对 hexo 文件夹检测，如果源文件夹没有，会自动删除 hexo 的博客，方便 hexo 文章的删除
转载记得标明原作者。
### 仓库地址
[Keduoli03/note-delivery: Obsidian笔记自动复制到其他文件夹并推送](https://github.com/Keduoli03/note-delivery)
### 参考资料
- [史上最简单易用的obsidian插件开发方法（适合新手） - 开发讨论 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/37149)
- [声明 | Obsidian 插件开发文档](https://luhaifeng666.github.io/obsidian-plugin-docs-zh/zh2.0/)
