---
title: Astro常用书写格式记录
description: 简单记录一下个人书写博客常用的各种小技巧
categories:
  - 博客
tags:
  - 笔记
  - 博客
series: 博客
cover: 
status: 未完成
date: 2025-04-23 00:47
updated: 2025-08-09 22:05
slug: "303355"
---

## 标注

一个合适的标注可以吸引读者注意，给予更好的阅读体验

由于笔者本身使用 Obsidian 进行本地书写，所以这里的标注有点五花八门的意思，先直接上写法吧

Astro 主题支持两种写法，推荐第一种

### 写法一

```markdown title="推荐"
:::NOTE
强调用户在浏览时应考虑的信息。
:::

:::TIP
可选信息，可帮助用户更成功。
:::

:::IMPORTANT
用户成功所必需的关键信息。
:::

:::WARNING
由于潜在风险，需要用户立即注意的关键内容。
:::

:::CAUTION
行动的负面潜在后果。
:::
```

**示例：**
:::NOTE
强调用户在浏览时应考虑的信息。
:::

:::TIP

可选信息，可帮助用户更成功。

:::

:::IMPORTANT

用户成功所必需的关键信息。

:::

:::WARNING

由于潜在风险，需要用户立即注意的关键内容。

:::

:::CAUTION

行动的负面潜在后果。

:::

#### 自定义标题

在标注类型后面的方括号中指定旁白的自定义标题，例如 `:::NOTE[你知道吗？]`。

 ::: NOTE[你知道吗？]

 我喜欢橘子

 :::

---

### 写法二

这是部分 markdown 支持的格式，但是 astro 我实际测试不支持 `CAUTION` 的标注，也不支持自定义标题

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
> [!TIP] 
> 如果你没有使用 Obsidian，可以跳过本节

经过网上资料([标注 - Obsidian帮助](https://help.obsidian.md/callouts))查找，Obsidian 本身貌似支持了很多 callout 的写法，大概如下

- note
- abstract, summary, tldr
- info, todo
- tip, hint, important
- success, check, done
- question, help, faq
- warning, caution, attention
- failure, fail, missing
- danger, error
- bug
- example
- quote, cite

#### 标题

直接在后面添加即可，示例如下

> [!TIP] 这是一个标题
> test

#### 折叠

可以使用 `+` 默认展开或者 `-` 默认折叠正文部分。

```text
> [!FAQ]- Are callouts foldable?
> Yes! In a foldable callout, the contents are hidden until it is expanded.
```

--- 

## 代码块

通过安装 [Expressive Cod](https://expressive-code.com/installation/#astro) 增强 Astro 的代码块
