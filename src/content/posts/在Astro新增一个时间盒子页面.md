---
title: 在Astro新增一个时间盒子页面
description: 自己写了一个页面，可以记录动漫、音乐、照片等
categories:
  - 博客
tags:
  - 大杂烩
series: 博客
cover: 
status: 未完成
date: 2025-04-29 17:41
updated: 2025-04-29 23:00
---
想着既然选择 Astro，就得写一些有自己风格的东西，思来想去，写个时间盒子吧！

其实就是一个展示页面啦，在本站你可以看到展示效果。

> [!NOTE]  
> 参考于友链页面，借鉴了一下写法
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
```ts title="src\constants\link-presets.ts" ins={6}
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
新建 `AnimeList.astro` 组件
```html title="AnimeList.astro"
---
// AnimeList.astro
export interface Props {
	timelineItems: {
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

const { timelineItems } = Astro.props;
---

<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {timelineItems
    .filter(item => item.type === 'anime')
    .map((item) => (
      <div class="anime-card group relative overflow-hidden rounded-lg shadow-md transition-shadow">
        <!-- 封面展示 -->
        <div class="anime-cover-container w-full bg-gray-200">
          <img src={item.cover} alt={item.title} class="w-full h-full object-fill transition-transform group-hover:scale-105" />
        </div>

        <!-- 亚克力蒙版 -->
        <div class="absolute bottom-0 left-0 right-0 h-0 overflow-hidden transition-all group-hover:h-40">
          <div class="bg-gray-500/20 dark:bg-gray-800/40 p-4 flex flex-col justify-end h-full rounded-t-lg backdrop-blur-[3px]">
            <!-- 标题与日期 -->
            <h3 class="title text-white text-base font-semibold mb-1 line-clamp-2">
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
/* 动漫卡片核心样式 */
.anime-card {
      @apply transition-shadow duration-300;
      transform: perspective(1000px);
      will-change: transform, box-shadow;
    }

    .anime-card:hover {
      @apply shadow-2xl;
      transform: scale(1.02);
    }

    .anime-cover-container {
      aspect-ratio: 3/4; /* 保持3:4比例 */
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .tag{
        color: white;
    }
</style>
```

新建 `MusicList.astro` 组件
```html title="MusicList.astro"
---
// MusicList.astro
export interface Props {
	timelineItems: {
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

const { timelineItems } = Astro.props;
---

<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {timelineItems
    .filter(item => item.type ==='music')
    .map((item) => (
      <div class="music-card group relative overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:shadow-lg">
        <div class="aspect-[1/1] w-full bg-gray-200 relative">
          <img
            src={item.cover}
            alt={`${item.title} - ${item.artist}`}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <svg class="w-12 h-12 text-white/90 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
            </svg>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300">
          <h3 class="text-white font-semibold truncate">{item.title}</h3>
          <p class="text-white font-semibold truncate ">{item.artist}</p>
          <div class="hidden group-hover:block"> <!-- 这里控制专辑和其他信息的显示 -->
            <p class="text-gray-300 text-250 mt-1">{item.album} • {new Date(item.date).getFullYear()}</p>
            <div class="flex gap-2 mt-3">
              {Object.entries(item.platform).map(([platform, link]) => (
                link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {/* 内联Spotify图标 */}
                    {platform ==='spotify' && (
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.56 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    )}
                    {/* 内联网易云图标 */}
                    {platform === 'netease' && (
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm3.5-11.5h-7c-.276 0-.5.224-.5.5v7c0 .276.224.5.5.5h7c.276 0 .5-.224.5-.5v-7c0-.276-.224-.5-.5-.5z"/>
                      </svg>
                    )}
                    {/* 内联QQ音乐图标 */}
                    {platform === 'qqmusic' && (
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-2.5-8h5c.276 0 .5-.224.5-.5v-4c0-.276-.224-.5-.5-.5h-5c-.276 0-.5.224-.5.5v4c0 .276.224.5.5.5z"/>
                      </svg>
                    )}
                    <span class="text-white/90 text-xs">
                      {platform ==='spotify' ? 'Spotify' : platform === 'netease' ? '网易云音乐' : 'QQ音乐'}
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
</div>
```

新建 `PhotoList.astro` 组件
```html title="PhotoList.astro"
---
// PhotoList.astro
export interface Props {
	timelineItems: {
		type: string;
		title: string;
		image: string;
		date: string;
		location: string;
		camera: string;
		tags: string[];
	}[];
}

const { timelineItems } = Astro.props;
---

<div class="grid grid-cols-2 gap-6">
    {timelineItems
      .filter(item => item.type === 'photo')
      .map((item) => (
        <div class="photo-card relative overflow-hidden rounded-lg shadow-md transition-shadow">
            <img 
                src={item.image} 
                alt={item.title} 
                class="w-full h-auto object-cover transition-transform group-hover:scale-105"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <h3 class="text-white text-sm font-semibold">{item.title}</h3>
                <p class="text-gray-300 text-xs">
                    {item.location} • {new Date(item.date).toLocaleDateString()}
                </p>
            </div>
        </div>
    ))}
</div>

<style>
     /* 照片卡片样式 */
     .photo-card {
            @apply relative overflow-hidden rounded-lg shadow-md transition-shadow;
        }

       .photo-card img {
            @apply w-full h-auto object-cover transition-transform group-hover:scale-105;
        }
</style>
```

在 `src\pages` 目录下，新建一个 `chronobox.astro` 文件
```html title="chronobox.astro"
---
import { getEntry } from "astro:content";
import AnimeList from "@/components/mine/Lists/AnimeList.astro";
import MusicList from "@/components/mine/Lists/MusicList.astro";
import PhotoList from "@/components/mine/Lists/PhotoList.astro";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import MainGridLayout from "@/layouts/MainGridLayout.astro";

import Markdown from "@components/misc/Markdown.astro";
const chronoboxPost = await getEntry("spec", "chronobox");
const { Content } = await chronoboxPost.render();

// 数据结构改造
const timelineItems = [
	{
		type: "anime",
		title: "Re:从零开始的异世界生活",
		cover:
			"https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/从零开始的异世界生活webp.webp",
		date: "2016-04-04",
		url: "https://example.com/re-zero", 
		episodes: "更新至第三季下半", 
		rating: 4.9, // 提升至合理评分区间
		tags: ["奇幻", "冒险", "剧情", "成长"] // 补充更精准标签
	},
	{
		type: "anime",
		title: "龙与虎",
		cover: "https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/龙与虎.webp",
		date: "2023-09-15",
		desc: "震撼结局，自由的定义引发深思",
		url: "https://example.com/aot",
		episodes: 25,
		rating: 4.8,
		tags: ["爱情", "奇幻"],
	},
	{
		type: "anime",
		title: "间谍过家家",
		cover:
			"https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/img/间谍过家家.webp",
		date: "2023-09-15",
		desc: "震撼结局，自由的定义引发深思",
		url: "https://example.com/aot",
		episodes: 25,
		rating: 4.8,
		tags: ["爱情", "奇幻"],
	},
	{
		type: "music",
		title: "爱在西元前",
		artist: "周杰伦",
		cover:
			"https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/%E4%BE%9D%E7%84%B6%E8%8C%83%E7%89%B9%E8%A5%BF.jpg",
		album: "BOOTLEG",
		date: "2023-08-02",
		platform: {
			// spotify: "https://spotify.com/lemon",
			netease: "https://music.163.com/lemon",
			qqmusic: "https://y.qq.com/n/yqq/song/0011223344.html", 
		},
	},
	{
		type: "photo",
		title: "京都红叶",
		image:
			"https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/FYwAUt5aQAU07-a.jpg",
		date: "2023-11-22",
		location: "清水寺",
		camera: "Sony A7IV",
		tags: ["旅行", "秋天"],
	},
];
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
              <button
              data-tab="anime"
              class="tab-button active px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative"
            >
              动漫
              <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
            </button>
            <button
            data-tab="music"
            class="tab-button px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative"
          >
            音乐
            <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
          </button>
          <button
          data-tab="photo"
          class="tab-button px-4 py-2 rounded-t-lg transition-colors duration-200 font-medium relative"
        >
        照片
          <span class="active-indicator absolute bottom-0 left-0 right-0 h-0.5 transition-opacity"></span>
        </button>
          </div>
          <!-- 动漫内容 -->
          <div id="anime-content" class="tab-content active">
              <AnimeList timelineItems={timelineItems} />
          </div>
          <!-- 音乐内容 -->
          <div id="music-content" class="tab-content hidden">
              <MusicList timelineItems={timelineItems} />
          </div>
          <!-- 照片内容 -->
          <div id="photo-content" class="tab-content hidden">
              <PhotoList timelineItems={timelineItems} />
          </div>
      </div>
  </div>

  <!-- 选项卡交互脚本 -->
  <script is:inline>
      document.addEventListener('DOMContentLoaded', () => {
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
                      c.classList.remove('active');
                      c.classList.add('hidden');
                  });

                  // 添加当前标签的激活状态
                  tab.classList.add('active');
                  tab.querySelector('.active-indicator').style.opacity = '1';

                  // 显示对应内容
                  const targetContentId = `${tab.dataset.tab}-content`;
                  const targetContent = document.getElementById(targetContentId);
                  targetContent.classList.remove('hidden');
                  targetContent.classList.add('active');
              });
          });
      });
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
      display: none;
      @apply transition-opacity duration-300 ease-in-out;
    }

    .tab-content.active {
      display: block;
      @apply opacity-100;
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

    @media (max-width: 1023px) {
      .anime-card,
      .music-card {
        min-width: calc(50% - 1rem); /* 双列宽度计算（配合gap-6） */
      }
    }

    /* 响应式调整 */
    @media (max-width: 767px) {
      .time-capsule-container {
        padding: 0 4px;
      }
      .anime-card {
        min-height: 200px; /* 移动端最小高度 */
      }
    }

    @media (min-width: 768px) {
      .anime-card {
        min-height: 350px; /* 平板端最小高度 */
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

每次只需要在此文件里添加信息即可，或者你也可以自行提取出去

## 待完善
- 2025-04-29 : 不知道为什么偶现选项卡无法切换的 bug，不知道触发条件，暂不知道如何修复
- 照片展示的日夜间暂未解决，必须手动刷新
