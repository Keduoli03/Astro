---
title: 在Astro新增一个时间盒子页面
description: 自己写了一个页面，可以记录动漫、音乐、照片等
categories:
  - 博客
tags:
  - 大杂烩
series: 博客
cover: 
status: 已完成
date: 2025-04-29 17:41
updated: 2025-08-08 23:46
slug: "772272"
---

---

想着既然选择 Astro，就得写一些有自己风格的东西，思来想去，写个时间盒子吧！

其实就是一个展示页面啦，在本站你可以看到展示效果。

> [!WARNING]
> 目前此方法已废弃，采用了更优的解决方案，此文章只做存档

> PS：目前采用的方案是：[bilibili-bangumi-component: 展示 bilibili 与 Bangumi 追番列表的 WebComponent 组件](https://github.com/yixiaojiu/bilibili-bangumi-component)

## 具体步骤

在 `src\content\spec` 目录下新建文件 `chronobox.md`。名字随意哈

在 `src\types\config.ts` 文件内添加以下内容

```ts title="src\types\config.ts" ins={7}
export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Series = 4,
	ChronoBox = 5,
}
```

在 `src\i18n\i18nKey.ts` 文件内添加以下内容

```ts title="src\i18n\i18nKey.ts" ins={6}
author = "author",
publishedAt = "publishedAt",
license = "license",
friends = "friends",
series = "series",
chronobox = "chronobox",
```

然后在对应的语言文件里继续添加 key，不多赘述

在 `src\constants\link-presets.ts` 文件内添加以下内容

```ts title="src\constants\link-presets.ts" ins={5-8}
[LinkPreset.Series]: {
	name: i18n(I18nKey.series),
	url: "/series/",
	},
[LinkPreset.ChronoBox]: {
	name: i18n(I18nKey.chronobox),
	url: "/chronobox/",
},
```

在 `src\components` 目录下，选择合适的位置，新建三个卡片组件

### AnimeList. astro 组件

新建 `AnimeList.astro` 组件

```html title="AnimeList.astro"
---
// AnimeList.astro
import type { Props as AstroProps } from "astro";

// 定义组件接收的属性接口
export interface Props {
	items: {
		type: string;
		title: string;
		cover: string;
		date: string;
		desc?: string;
		url: string;
		episodes: string | number;
		rating: number;
		tags: string[];
	}[];
}

// 从props中获取items，并添加空值检查
const { items = [] } = Astro.props as Props;

// 确保items是数组类型
if (!Array.isArray(items)) {
	throw new Error("AnimeList: items prop must be an array");
}
---

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {items.map((item) => (
    <div class="anime-card group relative overflow-hidden rounded-lg shadow-md transition-shadow">
      <!-- 封面展示 -->
      <div class="anime-cover-container w-full bg-gray-200">
        <img src={item.cover} alt={item.title} class="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>

      <!-- 亚克力蒙版 -->
      <div class="absolute bottom-0 left-0 right-0 h-0 overflow-hidden transition-all group-hover:h-44">
        <div class="bg-gray-500/60 dark:bg-gray-800/40 p-4 flex flex-col justify-end h-full rounded-t-lg backdrop-blur-[3px]">
          <!-- 标题与日期 -->
          <h3 class="title text-white text-sm font-semibold mb-1 line-clamp-3">
            {item.title}
          </h3>
          <time class="date text-white/90 text-xs mb-2">
            {new Date(item.date).toLocaleDateString()}
          </time>

          <!-- 核心信息栏 -->
          <div class="flex justify-between items-center">
            <!-- 集数信息 -->
            <div class="flex items-center gap-1.5 text-white/90">
              <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="text-xs font-medium">{item.episodes}</span>
            </div>

            <!-- 评分展示 -->
            <div class="flex items-center gap-1 text-white/90">
              ⭐
              <span class="text-xs font-medium">{item.rating.toFixed(1)}分</span>
            </div>
          </div>

          <!-- 椭圆标签 -->
          <div class="tag-cloud flex flex-wrap gap-1 mt-1">
            {item.tags.slice(0, 3).map(tag => (
              <span class="tag bg-white/25 dark:bg-black/25 px-1.5 py-0.5 rounded-full text-[8px] md:text-xs font-medium leading-tight">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <!-- 点击穿透层 -->
      <a href={item.url} class="absolute inset-0" target="_blank" rel="noopener noreferrer"></a>
    </div>
  ))}
</div>
<style>
/* 动漫卡片核心样式 */
.anime-card {
  @apply transition-shadow duration-300;
  transform: perspective(1000px);
  will-change: transform, box-shadow;
  aspect-ratio: 3/3; /* 改为正方形比例，高度会降低 */
  height: auto;
  max-width: 240px; /* 宽度保持不变 */
}

.anime-card:hover {
  @apply shadow-2xl;
  transform: scale(1.02);
}

.anime-cover-container {
  aspect-ratio: 3/3; /* 保持与卡片相同的比例 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .anime-card {
    max-width: 120px; /* 从160px减小到120px */
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .anime-card {
    max-width: 160px; /* 从190px减小到160px */
  }
}
</style>
```

### MusicList. astro 组件

新建 `MusicList.astro` 组件

```html title="MusicList.astro"
---
import type { Props as AstroProps } from "astro";

// 定义组件接收的属性接口
export interface Props {
	items: {
		type: string;
		title: string;
		artist: string;
		cover: string;
		album: string;
		date: string;
		platform: {
			[key: string]: string;
		};
	}[];
}

// 从props中获取items，设置默认空数组并添加类型检查
const { items = [] } = Astro.props as Props;

// 确保items是数组类型，避免后续操作报错
if (!Array.isArray(items)) {
	throw new Error("MusicList: items prop must be an array");
}
---

<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
  {items.map((item) => (
    <div class="music-card group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div class="aspect-square w-full bg-gray-200 relative">
        <img
          src={item.cover}
          alt={`${item.title} - ${item.artist}`}
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <svg class="w-8 h-8 text-white/90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
          </svg>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300">
        <h3 class="text-white text-[13px] font-semibold truncate line-clamp-1">
          {item.title}
        </h3>
        <p class="text-white/90 text-[11px] truncate line-clamp-1">
          {item.artist}
        </p>
        <div class="hidden group-hover:block mt-1.5">
          <p class="text-gray-400 text-[10px]">
            {item.album} • {new Date(item.date).getFullYear()}
          </p>
          <div class="flex gap-1.5 mt-2 flex-wrap">
            <div class="flex gap-1 mt-2 flex-wrap">
              {Object.entries(item.platform).map(([platform, link]) => (
                link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[9px] md:text-[11px] transition-colors leading-tight"
                  >
                    {platform === 'spotify' && (
                      <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.56 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    )}
                    {platform === 'netease' && (
                      <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm3.5-11.5h-7c-.276 0-.5.224-.5.5v7c0 .276.224.5.5.5h7c.276 0 .5-.224.5-.5v-7c0-.276-.224-.5-.5-.5z"/>
                      </svg>
                    )}
                    {platform === 'qqmusic' && (
                      <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-2.5-8h5c.276 0 .5-.224.5-.5v-4c0-.276-.224-.5-.5-.5h-5c-.276 0-.5.224-.5.5v4c0 .276.224.5.5.5z"/>
                      </svg>
                    )}
                    <span class="text-white/90 truncate">
                      {platform === 'spotify' ? 'Spotify' : platform === 'netease' ? '网易云' : 'QQ音乐'}
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

<style>
.music-card {
  @apply relative overflow-hidden rounded-xl shadow-md transition-all duration-300;
  aspect-ratio: 1/1;
  height: auto;
}

.music-card:hover {
  @apply shadow-xl -translate-y-1;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .music-card {
    max-width: 180px; /* 从120px增大到180px，适配一行两个的布局 */
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .music-card {
    max-width: 140px;
  }
}

@media (min-width: 1024px) {
  .music-card {
    max-width: 160px;
  }
}
</style>
```

### PhotoList.astro组件

新建 `PhotoList.astro` 组件

```html title="PhotoList.astro"
---
import { AstroProps } from 'astro';

// 定义组件接收的属性接口（将timelineItems改为items）
export interface Props {
  items: {
    type: string;
    title: string;
    image: string;
    date: string;
    location: string;
    camera: string;
    tags: string[];
  }[];
}

// 从props中获取items，设置默认空数组并添加类型检查
const { items = [] } = Astro.props as AstroProps<Props>;

// 确保items是数组类型，避免后续操作报错
if (!Array.isArray(items)) {
  throw new Error('PhotoList: items prop must be an array');
}
---

<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {items.map((item) => (
            <div 
                class="photo-card relative overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 group cursor-pointer"
                data-image={item.image}
                data-title={item.title}
                data-camera={item.camera}
                data-tags={JSON.stringify(item.tags)}
            >
                <div class="aspect-w-2 aspect-h-3 w-full">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <!-- 信息蒙版 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <!-- 左侧基础信息 -->
                    <div class="flex flex-col justify-end h-full">
                        <h3 class="text-white text-sm font-semibold mb-1">{item.title}</h3>
                        <div class="flex items-center gap-1 text-gray-300 text-xs">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{item.location}</span>
                        </div>
                        <time class="text-gray-400 text-xs">{new Date(item.date).toLocaleDateString()}</time>
                    </div>

                    <!-- 右侧信息（悬浮显示） -->
                    <div class="absolute bottom-4 right-4 flex flex-col items-end space-y-2 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
                        <!-- 相机信息 -->
                        <div class="flex items-center gap-1.5 text-white/80 text-xs">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span>{item.camera}</span>
                        </div>

                        <!-- 标签组 -->
                        <div class="flex flex-wrap gap-2 justify-end">
                            {item.tags.map(tag => (
                                <span class="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium transition-colors hover:bg-white/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ))}
</div>

<script is:inline>
// 使用立即执行函数封装代码，避免全局污染
(function() {
  // 模态框操作函数
  function openModal(imageUrl, title, camera, tags) {
    let modal = document.getElementById('modal');
    
    // 如果模态框不存在则创建
    if (!modal) {
      modal = createModalElement();
      document.body.appendChild(modal);
      
      // 添加全局事件监听（只需一次）
      setupGlobalListeners();
    }

    // 更新模态框内容
    document.getElementById('modal-image').src = imageUrl;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-camera').textContent = camera;
    
    // 渲染标签
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = tags.map(tag => `
      <span class="px-3 py-1 bg-white rounded-full text-sm shadow-sm border" style="background:var(--btn-regular-bg-active);">
        ${tag}
      </span>
    `).join('');
    
    // 显示模态框
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  }

  function createModalElement() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center z-50';
    
    // 获取主题色
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--primary').trim();

    modal.innerHTML = `
      <div class="rounded-xl max-w-6xl w-full md:max-w-5xl lg:max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl relative" style="background:var(--page-bg);">
        <button 
          id="modal-close-btn"
          class="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/30 rounded-full p-2 transition-colors backdrop-blur-sm z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="p-6 border-b border-gray-200">
          <h2 id="modal-title" class="text-2xl font-bold text-gray-900 mb-2" style="color: ${primaryColor};"></h2>
          <div class="flex items-center gap-4 text-gray-600">
            <div class="flex items-center gap-1">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span id="modal-camera"></span>
            </div>
            <div id="modal-tags" class="flex flex-wrap gap-2"></div>
          </div>
        </div>
        <div class="relative p-4">
          <img 
            id="modal-image"
            class="w-full h-auto max-h-[70vh] object-contain"
            loading="lazy"
          />
        </div>
      </div>
    `;
    return modal;
  }

  function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = ''; // 恢复滚动
    }
  }

  function setupGlobalListeners() {
    // 点击关闭按钮
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
    
    // 点击模态框背景关闭
    document.getElementById('modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal')) {
        closeModal();
      }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('modal')?.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.photo-card');
    if (card) {
      e.preventDefault();
      openModal(
        card.dataset.image,
        card.dataset.title,
        card.dataset.camera,
        JSON.parse(card.dataset.tags)
      );
    }
  });

})();
</script>

<style>
    .photo-card {
        @apply relative overflow-hidden rounded-xl shadow-lg transition-shadow duration-300;
        /* 移除所有宽度计算，完全依赖网格系统 */
    }

    .photo-card img {
        @apply w-full h-full object-cover transition-transform duration-300 group-hover:scale-105;
    }

    /* 右侧信息悬浮效果 */
    .photo-card .right-info {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .photo-card:hover .right-info {
        opacity: 1;
        pointer-events: auto;
    }

    /* 强制小屏幕单栏，中屏幕双栏，大屏幕三栏（可按需调整） */
    @media (min-width: 640px) {
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .md:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .lg:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
    }

    /* 仅在模态框非隐藏时应用居中样式 */
    #modal:not(.hidden) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* 确保隐藏时完全隐藏（覆盖可能的样式冲突） */
    #modal.hidden {
        display: none !important;
    }

    #modal-title {
        color: var(--primary)!important; /* 使用主题主色 */
        /* 响应式调整（可选） */
        @media (max-width: 768px) {
            font-size: 1.25rem !important; /* 小屏幕缩小字体 */
        }
    }

    /* 模态内容居中（保持不变） */
    #modal > div {
        margin: auto;
    }
</style>
```

### BookList. astro 组件

```html
---
import { AstroProps } from 'astro';

// 定义组件接收的属性接口（将timelineItems改为items）
export interface Props {
  items: {
    type: string;
    title: string;
    cover: string;
    author: string;
    date: string;
    desc?: string;
    url: string;
    rating: number;
    tags: string[];
  }[];
}

// 从props中获取items，设置默认空数组并添加类型检查
const { items = [] } = Astro.props as AstroProps<Props>;

// 确保items是数组类型，避免后续操作报错
if (!Array.isArray(items)) {
  throw new Error('BookList: items prop must be an array');
}
---

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  {items.map((item) => (
    <div class="book-card group relative overflow-hidden rounded-lg shadow-md transition-shadow">
      <!-- 封面展示 -->
      <div class="book-cover-container w-full bg-gray-200">
        <img src={item.cover} alt={item.title} class="w-full h-full object-cover transition-transform group-hover:scale-105" />
      </div>

      <!-- 亚克力蒙版 -->
      <div class="absolute bottom-0 left-0 right-0 h-0 overflow-hidden transition-all group-hover:h-36">
        <div class="bg-gray-500/60 dark:bg-gray-800/40 p-4 flex flex-col justify-end h-full rounded-t-lg backdrop-blur-[3px]">
          <!-- 标题与作者 -->
          <h3 class="title text-white text-base font-semibold mb-1 line-clamp-2">
            {item.title}
          </h3>
          <p class="author text-white/80 text-xs mb-2">
            作者: {item.author}
          </p>

          <!-- 评分展示 -->
          <div class="flex items-center gap-1 text-white/90 mb-2">
            ⭐
            <span class="text-xs font-medium">{item.rating.toFixed(1)}分</span>
          </div>

          <!-- 椭圆标签 -->
          <div class="tag-cloud flex flex-wrap gap-1.5 mt-2">
            {item.tags.map(tag => (
              <span class="tag bg-white/25 dark:bg-black/25 px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <!-- 点击穿透层 -->
      <a href={item.url} class="absolute inset-0" target="_blank" rel="noopener noreferrer"></a>
    </div>
  ))}
</div>

<style>
.book-card {
  @apply transition-shadow duration-300;
  transform: perspective(1000px);
  will-change: transform, box-shadow;
  aspect-ratio: 3/4; /* 书籍封面比例 */
  height: auto;
  max-width: 180px; /* 限制最大宽度 */
}

.book-card:hover {
  @apply shadow-2xl;
  transform: scale(1.02);
}

.book-cover-container {
  aspect-ratio: 3/4;
  position: absolute;
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .book-card {
    max-width: 140px;
  }
}

@media (min-width: 1024px) {
  .book-card {
    max-width: 160px;
  }
}
</style>
```

### 父组件

在 `src\pages` 目录下，新建一个 `chronobox.astro` 文件

```html title="chronobox.astro"
---
import { getEntry } from "astro:content";
import BookList from "@components/mine/Lists/BookList.astro";
import Markdown from "@components/misc/Markdown.astro";
import AnimeList from "@/components/mine/Lists/AnimeList.astro";
import MusicList from "@/components/mine/Lists/MusicList.astro";
import PhotoList from "@/components/mine/Lists/PhotoList.astro";
import { animeData } from "@/data/anime.js";
import { bookData } from "@/data/book.js";
import { musicData } from "@/data/music.js";
import { photoData } from "@/data/photo.js";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import MainGridLayout from "@/layouts/MainGridLayout.astro";

const chronoboxPost = await getEntry("spec", "chronobox");
const { Content } = await chronoboxPost.render();
// 按类型组织数据
const timelineData = {
	anime: animeData,
	book: bookData,
	music: musicData,
	photo: photoData,
};
---


<MainGridLayout title={i18n(I18nKey.chronobox)} description={i18n(I18nKey.chronobox)}>
  <Markdown class="mt-8 prose max-w-none">
      <Content />
  </Markdown>

<!-- 选项卡容器 -->
  <div class="time-capsule-container">
      <div class="card-base z-10 px-9 py-6 relative w-full">
          <!-- 选项卡导航 -->
          <div class="tabs-header flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
              <button data-tab="anime" class="tab-button active px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative">
                  动漫
                  <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
              </button>
              <button data-tab="book" class="tab-button px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative">
                  书籍
                  <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
              </button>
              <button data-tab="music" class="tab-button px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative">
                  音乐
                  <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
              </button>
              <button data-tab="photo" class="tab-button px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative">
                  图片
                  <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
              </button>
          </div>
         <!-- 数据（直接使用对应类型的数据） -->
          <div id="anime-content" class="tab-content">
              <AnimeList items={timelineData.anime} />
          </div>
          <div id="music-content" class="tab-content hidden">
              <MusicList items={timelineData.music} />
          </div>
          <div id="photo-content" class="tab-content hidden">
              <PhotoList items={timelineData.photo} />
          </div>
          <div id="book-content" class="tab-content hidden">
              <BookList items={timelineData.book} />
          </div>
      </div>
  </div>

  <!-- 选项卡交互脚本 -->
  <script is:inline>
(function() {
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有标签的激活状态
      tabs.forEach(t => {
        t.classList.remove('active');
        t.querySelector('.active-indicator').style.opacity = '0';
      });
      
      // 隐藏所有内容
      contents.forEach(c => {
        c.classList.add('hidden');
      });
      // 添加当前标签的激活状态
      tab.classList.add('active');
      tab.querySelector('.active-indicator').style.opacity = '1';
      // 显示对应内容
      const targetContentId = `${tab.dataset.tab}-content`;
      document.getElementById(targetContentId).classList.remove('hidden');
    });
  });
})();
</script>

  <style is:global>
    /* 新增选项卡样式 */
    .tabs-header {
      @apply border-b border-gray-200 dark:border-gray-700;
    }

    .tab-button {
      @apply transition-colors duration-200 text-gray-600 dark:text-gray-300;
    }
    

    .tab-button.active {
      color: var(--primary); /* 使用Tailwind内置颜色 */
    }

    .tab-button.active .active-indicator {
      @apply opacity-100;
    }

    .tab-content {
    @apply hidden;
  }
  
  .tab-content:not(.hidden) {
    display: block;
    animation: fadeIn 0.3s ease-out;
  }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    

    /* 电脑端额外优化（新增） */
    @media (min-width: 1024px) {
      .grid-cols-3 > * {
        width: calc((100% - 1.5rem) / 3); /* 精确计算列宽，避免间隙影响 */
      }
      .anime-card {
        min-height: 500px; /* 增大桌面端最小高度，匹配比例 */
      }
    }

    /* 信息层动画（使用标准CSS过渡） */
    .anime-card .info-overlay {
      height: 0;
      overflow: hidden;
      transition: height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .anime-card:hover .info-overlay {
      height: 100px; /* 自定义合适高度 */
    }

   

    /* 响应式调整 */
    @media (max-width: 767px) {
      .time-capsule-container {
        padding: 0 4px;
      }
      .anime-card {
        min-height: 200px; /* 移动端最小高度 */
        width: auto;
      }
    }

    @media (min-width: 768px) {
      .anime-card {
        min-height: 350px; /* 平板端最小高度 */
      }
    }

    /* 响应式调整 */
    @media (max-width: 640px) {
      .anime-card {
        min-height: 180px; /* 减小移动端最小高度 */
        max-width: 100px; /* 与AnimeList组件保持一致 */
        width: auto;
      }
      .music-card {
        max-width: 120px; /* 与MusicList组件保持一致 */
      }
    }

    @media (min-width: 641px) and (max-width: 1023px) {
      .anime-card {
        min-height: 280px; /* 调整平板端高度 */
        max-width: 140px; /* 与AnimeList组件保持一致 */
      }
      .music-card {
        max-width: 140px;
      }
    }

    @media (min-width: 1024px) {
      .anime-card {
        min-height: 350px;
        max-width: 240px; /* 桌面端保持原有设置 */
      }
      .music-card {
        max-width: 160px;
      }
    }

    /* 移除调试边框 */
    .grid,
    .capsule-card {
      border: none;
    }
    
  </style>
</MainGridLayout>
```
