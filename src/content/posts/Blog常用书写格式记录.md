---
title: Blog常用书写格式记录
description: 部分内容只适用于本博客
categories:
  - 博客
tags:
  - 笔记
  - 博客
series: 博客
cover:
status: 未完成
date: 2025-04-23 00:47
updated: 2025-09-09 19:03
slug: "303355"
---

## 标注

一个合适的标注可以吸引读者注意，给予更好的阅读体验

由于笔者本身使用 Obsidian 进行本地书写，而 Fuwari 自带的样式没有做到很好的兼容，我尝试修改一番后也没有很好的效果，然后找到了 [rehype-callout](https://github.com/lin-stephanie/rehype-callouts)，这是一个现成的插件，支持 github、obsidian 等样式和写法，算是完美解决了我的问题。

```markdown title="参考于Github"
> [!NOTE]  
> 强调用户在浏览时应考虑的信息。

> [!TIP]
> 可选信息，可帮助用户更成功。

> [!IMPORTANT]  
> 用户成功所必需的关键信息。

> [!WARNING]  
> 由于潜在风险，需要用户立即注意的关键内容。

> [!CAUTION]
> 行动的负面潜在后果。
```

**示例**

> [!NOTE]
> 强调用户在浏览时应考虑的信息。

> [!TIP]
> 可选信息，可帮助用户更成功。

> [!IMPORTANT]
> 用户成功所必需的关键信息。

> [!WARNING]
> 由于潜在风险，需要用户立即注意的关键内容。

> [!CAUTION]
> 行动的负面潜在后果。

---

### 探索 Obsidian

关于更多的语法可以参考这里(留空)。

--- 

## 代码块

通过安装 [Expressive Cod](https://expressive-code.com/installation/#astro) 增强 Astro 的代码块
