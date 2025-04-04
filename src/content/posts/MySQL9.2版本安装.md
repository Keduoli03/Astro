---
title: MySQL9.2版本安装
excerpt: MySQL9.2版本安装配置
categories:
  - 计算机
tags:
  - 数据库
  - 笔记
cover: https://api.miaomc.cn/image/get
status: 未完成
date: 2025-03-21 11:31
updated: 2025-04-04 19:32
---

电脑一重装，我的数据库又又没了，每次配置都要慢慢折腾，还经常有问题，索性写一个完整过程了。
<!--more-->
## 下载
下载地址：[MySQL](https://dev.mysql.com/downloads/mysql/)
### 安装
1. 接受协议，点击 `next`
2. 选择 `custom`，自定义安装 ![MySQL9.2版本安装-202503211135|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211135.png)
3. 最下面可以更改安装路径，默认 C 盘，选择好之后点击 `next` ，然后点击 `install` 安装 ![MySQL9.2版本安装-202503211136|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211136.png)
4. 安装好后勾选下面的选项，还需要进行配置![MySQL9.2版本安装-202503211139|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211139.png)
5. data数据存放目录，现在还没办法更改，所以我们直接点击下一步![MySQL9.2版本安装-202503211141|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211141.png)
6. 这一页默认即可，点击下一步![MySQL9.2版本安装-202503211144|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211144.png)
7. 设置密码，也可以添加用户，设置好后点击下一步![MySQL9.2版本安装-202503211145|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211145.png)
8. 保持默认，下一步![MySQL9.2版本安装-202503211146|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211146.png)
9. 保持默认，下一步![MySQL9.2版本安装-202503211147|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211147.png)
10. 这里给了两个示例数据库，可以勾选看一下，不选也没什么![MySQL9.2版本安装-202503211149|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211149.png)
11. 点击 `excute`，正常情况下会全部通过 ![MySQL9.2版本安装-202503211150|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211150.png) 但如果你和我一样，那就很可能是因为你的 MySQL 配置文件中出现了中文(log 中有中文乱码)
> 解决方法：进入到 `C:\ProgramData\MySQL` 下，找到你所安装的数据库，找到 `my.ini` 文件，将所有中文换成英文
> 如果权限不足无法保存，右键该文件=>属性=>安全=>将用户权限全勾上即可
12. 点击下一步 ![MySQL9.2版本安装-202503211213|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211213.png)
13. 点击 finish 安装即可完成

#### 修改数据路径
如果你想修改数据地址，找到上面的 `my.ini`，修改这一行即可
```ini
datadir= 你的路径/Data
```

然后原来的文件夹下有个 Data，复制过去即可(还有个 uploads 文件夹，也可以这么更改)
最后在任务管理器重新启动数据库服务即可
![MySQL9.2版本安装-202503211236|450](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/MySQL9.2%E7%89%88%E6%9C%AC%E5%AE%89%E8%A3%85-202503211236.png)


#### Navicat
Navicat 是个非常好用的数据库管理软件，现在也出了 lite 版可以免费使用
下载地址：[Navicat | 免费下载 Navicat Premium Lite](https://www.navicat.com.cn/download/navicat-premium-lite)
