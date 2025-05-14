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
updated: 2025-05-14 18:22
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

在标注类型后面的方括号中指定旁白的自定义标题，例如 `:::tip[你知道吗？]`。
比如
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
折叠


## html 实现

### 选项卡

````html title="推荐" collapse={3-68}
<!-- 将此代码块直接粘贴到你的Markdown文件中 -->
<div class="md-tabs">
  <div class="md-tab-labels">
    <button class="md-tab-label active" data-tab="tab1">Tab1</button>
    <button class="md-tab-label" data-tab="tab2">Tab2</button>
    <button class="md-tab-label" data-tab="tab3">Tab3</button>
    <!-- 添加更多标签只需复制button行 -->
  </div>
  <div class="md-tab-contents">
    <div id="tab1" class="md-tab-content active">
      **这里是Tab1的内容**  
      支持Markdown语法：
      - 列表项
      - `代码高亮`
      ```python
      print("Hello Tabs!")
      ```
    </div>
    <div id="tab2" class="md-tab-content">
      ## Tab2标题  
      表格示例：
      | 名称 | 值 |
      |---|---|
      | A | 1 |
    </div>
    <div id="tab3" class="md-tab-content">
      > 引用块也能正常显示  
      图片示例：  
      ![示例](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/E8uWFJnVcAIMcOB.jpg)
    </div>
    <!-- 添加更多内容需保持id与data-tab对应 -->
  </div>
</div>

<style>
.md-tabs {
  margin: 1em 0;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}
.md-tab-labels {
  display: flex;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}
.md-tab-label {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: inherit;
}
.md-tab-label.active {
  border-bottom-color: #f9826c;
  font-weight: 600;
}
.md-tab-content {
  display: none;
  padding: 16px;
}
.md-tab-content.active {
  display: block;
}
</style>

<script>
document.querySelectorAll('.md-tab-label').forEach(label => {
  label.addEventListener('click', () => {
    document.querySelectorAll('.md-tab-label, .md-tab-content').forEach(el => {
      el.classList.remove('active');
    });
    label.classList.add('active');
    document.getElementById(label.dataset.tab).classList.add('active');
  });
});
</script>
````

**效果**

<!-- 将此代码块直接粘贴到你的Markdown文件中 -->
<div class="md-tabs">
  <div class="md-tab-labels">
 <button class="md-tab-label active" data-tab="tab1">Tab1</button>
 <button class="md-tab-label" data-tab="tab2">Tab2</button>
 <button class="md-tab-label" data-tab="tab3">Tab3</button>
 <!-- 添加更多标签只需复制button行 -->
  </div>
  <div class="md-tab-contents">
 <div id="tab1" class="md-tab-content active">
   **这里是Tab1的内容**
   支持Markdown语法：
   - 列表项
   - `代码高亮`
   ```python
   print("Hello Tabs!")
   ```
 </div>
 <div id="tab2" class="md-tab-content">
   ## Tab2标题
   表格示例：
   | 名称 | 值 |
   |---|---|
   | A | 1 |
 </div>
 <div id="tab3" class="md-tab-content">
   > 引用块也能正常显示
   图片示例：
   ![示例](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/E8uWFJnVcAIMcOB.jpg)
 </div>
 <!-- 添加更多内容需保持id与data-tab对应 -->
  </div>
</div>

<style>
.md-tabs {
  margin: 1em 0;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}
.md-tab-labels {
  display: flex;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}
.md-tab-label {
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: inherit;
}
.md-tab-label.active {
  border-bottom-color: #f9826c;
  font-weight: 600;
}
.md-tab-content {
  display: none;
  padding: 16px;
}
.md-tab-content.active {
  display: block;
}
</style>

<script>
document.querySelectorAll('.md-tab-label').forEach(label => {
  label.addEventListener('click', () => {
 document.querySelectorAll('.md-tab-label, .md-tab-content').forEach(el => {
   el.classList.remove('active');
 });
 label.classList.add('active');
 document.getElementById(label.dataset.tab).classList.add('active');
  });
});
</script>

备选二

````html collapse={4-57, 70-120} title="需要手动维护css"
<div class="tab-container"> <!-- 添加container类 -->
  <input type="radio" id="tab1" name="tabs" checked>
  <label for="tab1">选项卡 1</label>

  <input type="radio" id="tab2" name="tabs">
  <label for="tab2">选项卡 2</label>

  <input type="radio" id="tab3" name="tabs">
  <label for="tab3">选项卡 3</label>

   <input type="radio" id="4" name="tabs">
  <label for="4">选项卡 4</label>
  <!-- 内容区域必须放在所有radio之后 -->
  <div class="tab-content" data-tab="tab1">
 <p>这是选项卡 1 的内容。</p>
  </div>

  <div class="tab-content" data-tab="tab2">
 <p>这是选项卡 2 的内容。</p>
  </div>

  <div class="tab-content" data-tab="tab3">
 <p>这是选项卡 3 的内容。</p>
  </div>

  <div class="tab-content" data-tab="tab4">
 <p>这是选项卡 4 的内容。</p>
  </div>
  </div>
  <style>
    /* 基础样式保持不变 */
    input[type="radio"] {
  display: none;
    }
    /* 灰色配色 */
    /* label {
  display: inline-block;
  padding: 12px 24px;
  background: #e9e9e9;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: background 0.3s;
    }

    input[type="radio"]:checked + label {
  background: #f3f3f3;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    }

    .tab-content {
  display: none;
  padding: 20px;
  background: #f3f3f3;
  border-radius: 0 8px 8px 8px;
    } */

  /* 柔和渐变 */
  /* 柔白 */
  /*
  label {
    display: inline-block;
    padding: 12px 24px;
    margin-right: 8px;  
    background: #f7f7f7;
    color: #484848;
    border-radius: 8px 8px 0 0;
    border: 1px solid #ebebeb;
    border-bottom: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 15px;
  }

  label:hover {
    background: #f0f0f0;
  }

  input[type="radio"]:checked + label {
    background: white;
    color: #ff5a5f;
    box-shadow: 0 -3px 0 #ff5a5f inset;
    border-color: #ddd;
    font-weight: 500;
  }

  .tab-content {
    padding: 24px;
    background: white;
    border: 1px solid #ebebeb;
    border-top: none;
    border-radius: 0 0 8px 8px;
    margin-top: -1px;
  }
  */
  /* 浅蓝 */
  /* label {
    padding: 12px 24px;
    margin-right: 6px;
    background: #f5f8ff;
    color: #4a6baf;
    border-radius: 8px 8px 0 0;
    transition: all 0.2s;
  }

  input[type="radio"]:checked + label {
    background: white;
    color: #1a56db;
    box-shadow: 0 0 0 1px #e0e7ff,
    0 2px 4px rgba(0,0,0,0.05);
  }

  .tab-content {
    padding: 24px;
    background: white;
    border-radius: 0 8px 8px 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  } */

  /*浅色Material You*/
  label {
    padding: 12px 24px;
    margin-right: 4px;
    background: #f3edf7;
    color: #49454f;
    border-radius: 16px 16px 0 0;
    font-family: 'Roboto', sans-serif;
    transition: all 0.2s;
  }

  input[type="radio"]:checked + label {
    background: #e8def8;
    color: #6750a4;
    box-shadow: 0 -2px 0 #6750a4 inset;
  }

  .tab-content {
    padding: 24px;
    background: #f3edf7;
    border-radius: 0 0 16px 16px;
    margin-top: 4px;
  }

    .tab-container input[type="radio"]:checked ~ .tab-content {
  display: none;
    }

    #tab1:checked ~ [data-tab="tab1"],
    #tab2:checked ~ [data-tab="tab2"],
    #tab3:checked ~ [data-tab="tab3"] {
  display: block;
  animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
    }
  </style>

````

示例

不知道为啥，上面会影响下面这个选项卡，无法点击切换
<div class="tab-container">
 <input type="radio" id="tab1" name="tabs" checked>
 <label for="tab1">选项卡 1</label>
 <input type="radio" id="tab2" name="tabs">
 <label for="tab2">选项卡 2</label>
 <input type="radio" id="tab3" name="tabs">
 <label for="tab3">选项卡 3</label>
 <input type="radio" id="tab4" name="tabs">
 <label for="tab4">选项卡 4</label>
 <div class="tab-content" data-tab="tab1">
  <p>这是选项卡 1 的内容。</p>
 </div>
 <div class="tab-content" data-tab="tab2">
  <p>这是选项卡 2 的内容。</p>
 </div>
 <div class="tab-content" data-tab="tab3">
  <p>这是选项卡 3 的内容。</p>
 </div>
 <div class="tab-content" data-tab="tab4">
  <p> ![示例](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/E8uWFJnVcAIMcOB.jpg)</p>
 </div>
</div>
<style>
 input[type="radio"] {
  display: none;
 }
 label {
  display: inline-block;
  padding: 12px 24px;
  margin-right: 8px;
  background: #f7f7f7;
  color: #484848;
  border-radius: 8px 8px 0 0;
  border: 1px solid #ebebeb;
  border-bottom: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
 }
 label:hover {
  background: #f0f0f0;
 }
 input[type="radio"]:checked + label {
  background: white;
  color: #ff5a5f;
  box-shadow: 0 -3px 0 #ff5a5f inset;
  border-color: #ddd;
  font-weight: 500;
 }
 .tab-content {
  display: none;
  padding: 24px;
  background: #f3edf7;
  border-radius: 0 0 16px 16px;
  margin-top: 4px;
 }
 .tab-container input[type="radio"]:checked ~ .tab-content {
  display: none;
 }
 #tab1:checked ~ [data-tab="tab1"],
 #tab2:checked ~ [data-tab="tab2"],
 #tab3:checked ~ [data-tab="tab3"],
 #tab4:checked ~ [data-tab="tab4"] {
  display: block;
  animation: fadeIn 0.3s;
 }
 @keyframes fadeIn {
  from {
   opacity: 0;
  }
  to {
   opacity: 1;
  }
 }
</style>


### 分栏
```html
<!-- 分栏 -->
<!-- <div style="display: flex; justify-content: space-between;">

<div style="width: 48%;">

  </div>
<div style="width: 48%;">

</div>
</div> -->
```
