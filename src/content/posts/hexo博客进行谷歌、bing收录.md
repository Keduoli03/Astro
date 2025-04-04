---
title: hexo博客进行谷歌、bing收录
excerpt: 折腾一下搜索引擎收录，顺便优化一下文章链接
categories:
  - 博客
tags:
  - 博客
  - Hexo
cover: https://imgapi.xl0408.top/index.php
status: 已完成
date: 2025-03-17 13:55:26
updated: 2025-03-22 20:36:34
---

博客运行了也有一年多了，但是几乎没有人访问多少有点寂寞了，所以来折腾一下搜索引擎收录
<!--more-->

## 推送插件
这里我是用的是 [hexo-seo-submit](https://github.com/tardis-ksh/hexo-seo-submit) 插件，这个插件支持在 Github 和 Coding 平台中每天自动提交你的最新文章链接（或本地手动）至搜索引擎，让搜索引擎更快的收录你的文章。
要想知道直接的博客是否被搜索引擎搜录，可在搜索引擎下搜索:
```txt
site:你的域名
```
### 安装
```bash
npm install hexo-seo-submit
```

### 本地配置
我使用的是本地配置，如果想要别的配置方式，也可以参考作者的文章 [hexo-seo-submit使用](https://ksh7.com/posts/docs-hexo-seo-submit/index.html#%E4%BD%BF%E7%94%A8)
作者的文章还是十分详尽的。
1. 首先我们要在本地的 `_config.yml` 中添加以下配置
```yml
hexo-seo-submit:
  baidu:
    enable: true # 是否启用
    token: you baidu token # token
  google:
    enable: true
    accountKeysJSonFile: google.json # 谷歌账户密钥文件路径，默认 root 目录寻找
    proxy: http://127.0.0.1:7890 #代理，防止谷歌无法收录
  bing:
    enable: true
    apiKey: your bing api key

# 注意在此处配置
deploy:
  - type: hexo-seo-submit
```

### 申请凭证
### 百度 Baidu
1. 登录到[站点管理](https://ziyuan.baidu.com/site/index#/)，添加站点，我选择的是 html 文件验证，将文件下载放到 source 文件夹下
PS：如果验证不通过，可能是 hexo 把 layout 元素也渲染到这个页面了，添加属性隐藏即可(谷歌、Bing 应该也有这个问题)
```html
---
layout: false
---
055171964
```
2. 验证成功后选择普通收录，将 token 添加到配置即可

### 谷歌 Google
1. 进入 [Web Search Indexing API](https://console.cloud.google.com/apis/library/indexing.googleapis.com)，选择项目并启用API‘，没有可新建一个
2. 点击`管理`按钮（API启用后即可看到），进入`凭据`菜单，选择`创建凭据` => `服务账号`
3. 填写 `服务账号ID` ，`服务名称` 可选，随后可直接点击 `完成`
4. 点击创建好的[服务密钥](https://console.cloud.google.com/apis/credentials)，点击 `密钥` => `添加密钥`，选择 `创建新密钥`，选择 `JSON` 格式，点击 `创建`，下载 json 文件
5. 下载好的 json 文件就是上面 `accountKeysJSonFile` 的路径值，放到博客目录里(我是直接重命名成google. json了)
6. 验证。打开 [google search-console](https://search.google.com/search-console/users) 进行网址认证，我选择的是 html 文件认证，因为我的主题不太方便插入标记。将 html 文件直接放到 source 文件夹里即可，然后点击验证即可通过。
7. 然后再 `设置` => `用户和权限` => `添加用户`，邮箱为 `client_email` (json文件里有，google 控制台也能找到)

然后谷歌的凭证就申请好了，打开 https://console.cloud.google.com/apis/api/indexing.googleapis.com/metrics ，选择你的项目，进行验证。(一般需要 48 小时)

这时候你去搜索 `site:你的站点` 应该就能访问到了
PS:
### 必应 Bing
有了谷歌的基础，Bing 就很简单了
1. 打开 https://www.bing.com/webmasters/home ，选择谷歌账号登录（可同步 Google Search Console，无需再验证）
2. 点击右上角的 `设置` => `API 访问` => 复制 API 密钥，然后在配置中填入即可
在 `url 提交` 菜单中可查看是否成功(也需要 48 小时)




## 修改链接地址
我的博客地址是 hexo 默认的 `:year/:month/:day/:title`，也就是按照年、月、日、标题来生成固定链接的。如 `http://xxx.yy.com/2025/03/18/hello-world` 感觉非常的长啊，不利于收录。
这里我用的是 [hexo-abbrlink](https://github.com/ohroy/hexo-abbrlink)，感觉还是很不错的

### 安装插件
```bash
npm install hexo-abbrlink --save
```


### 修改配置
修改原有的配置文件(`_config. yml`)
```yml
permalink: posts/:abbrlink.html  # 此处可以自己设置，也可以直接使用 :/abbrlink
# abbrlink config  
abbrlink:  
  alg: crc16      #support crc16(default) and crc32  
  rep: hex        #support dec(default) and hex  
  drafts: false   #(true)处理草稿，(false)不处理草稿。false（默认值）  
  # 从目录树生成类别  
  # 深度：要生成的目录树的最大深度应大于0  
  auto_category:  
    enable: true  #true(default)  
    depth:        #3(default)  
    over_write: false   
  auto_title: false #启用自动标题，可以按路径自动填充标题  
  auto_date: false #启用自动日期，它可以自动填写日期的时间今天  
  force: false #启用强制模式，在这种模式下，插件将忽略缓存，并为每个帖子计算abbrlink，即使它已经有了abbrlink。
```

然后更新博客即可

## 站点地图
hexo 的网页结构可能被搜索引擎错误识别，这时候我们需要提供站点地图
```bash
npm install hexo-generator-sitemap --save		    #sitemap.xml适合提交给谷歌搜素引擎
npm install hexo-generator-baidu-sitemap --save		#baidusitemap.xml适合提交百度搜索引擎
```

修改配置文件
```yml
# 自动生成sitemap
sitemap:
	path: sitemap.xml
baidusitemap:
	path: baidusitemap.xml
```

然后执行一遍 `hexo g`，我们就能在 `public` 目录下找到 sitmap 文件了
然后去到搜索引擎平台，提交站点地图即可
> 比如我的是
> ```txt
> https://www.blueke.top/sitemap.xml
> ```
>  


## 蜘蛛协议
- 搜索引擎用来爬行和抓取页面的程序也就是我们熟知的蜘蛛（spider），也称为机器人（bot）。spider 访问网站页面类似于普通用户使用的浏览器。spider 发出页面访问请求后，服务器返回 HTML 代码，spider 把收到的程序存入原始页面数据库。为了提高爬行和抓取速度，搜索引擎通常或多个 spider 并行爬行
- spider 访问任何一个网站时，都会先访问该网站根目录下的 rotbots.txt 文件。该文件可以告诉 spider 哪些文件或目录可以抓取或者禁止抓取
- 根据以上内容，我们可以通过设置 rotbots.txt 文件来进行相应设置
### 配置
在 `hexo/source` 文件夹下新建 `robots.txt` 文件，文件内容如下：
```txt
User-agent: *
Allow: /
Allow: /archives/
Allow: /categories/
Allow: /tags/ 
Allow: /resources/ 
Disallow: /vendors/
Disallow: /js/
Disallow: /css/
Disallow: /fonts/
Disallow: /vendors/
Disallow: /fancybox/
# 下面中间部分写你自己的域名
Sitemap: https://你的域名/sitemap.xml
Sitemap: https://你的域名/baidusitemap.xml
```
- `Allow` 字段的值即为允许搜索引擎爬区的内容  
	`Disallow` 字段的值为不允许搜索引擎爬区的内容  
	`Sitemap` 字段的值就是网站地图，专门给爬虫用的
- 对于允许不允许的值，可以对应到主题配置文件中的 menu 目录配置，如果菜单栏还有其他选项都可以按照格式自行添加


### 下面未完成，待完善
#### 压缩文件
#新对话 
  

{% link https://www.wrysmile.cn/Hexo-03.html %}




---
![[hexo博客进行谷歌、bing收录-202503181213.png]]


压缩后
![[hexo博客进行谷歌、bing收录-202503181214.png]]




#### 参考来源
-  [hexo-seo-submit使用](https://ksh7.com/posts/docs-hexo-seo-submit/index.html#%E4%BD%BF%E7%94%A8)
- [Hexo博客之高级优化教程 | Wrysmile 的博客](https://www.wrysmile.cn/Hexo-03.html) 
