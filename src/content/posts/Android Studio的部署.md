---
title: Android Studio的部署
excerpt: 简单记录一下
categories:
  - 计算机
tags:
  - 笔记
cover: http://www.98qy.com/sjbz/api.php
status: 已完成
date: 2025-03-11 19:26
updated: 2025-04-04 19:22
slug: "946133"
---

简单记录一下，现在都比较人性化了，安装很方便
<!--more-->
## 下载
官方下载地址：[下载 Android Studio 和应用工具 - Android 开发者  |  Android Developers](https://developer.android.google.cn/studio?hl=zh-cn)
直接点击下载即可
![Android Studio的部署-202503111930|825](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Android%20Studio%E7%9A%84%E9%83%A8%E7%BD%B2-202503111930.png)

下载好点击安装，默认安装到 C 盘，根据自己需求更改
![[Pasted image 20250311193859.png|500]] 然后等待安装完成
## 配置
打开后首先弹出一个像谷歌发送报告，选择不发送
提示缺少组件，选择 custom
![Pasted image 20250311194244|500](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Pasted%20image%2020250311194244.png)
然后自己选个位置存放 SDK 不然默认放到 C 盘
![Android Studio的部署-202503111944|500](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Android%20Studio%E7%9A%84%E9%83%A8%E7%BD%B2-202503111944.png)

然后就是同意协议，等待下载安装


## 简单应用
新建项目--选择 empty Activity
![Pasted image 20250311200403|475](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Pasted%20image%2020250311200403.png)

自己填写名称等信息
![Android Studio的部署-202503112006|600](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Android%20Studio%E7%9A%84%E9%83%A8%E7%BD%B2-202503112006.png)

点击完成后就可以进入项目了，但是还需要等待下载资源（官方是真慢，自己换个国内源）
换源：在 gradle--wrapper 的 `gradle-wrapper.properties` 文件中
修改源
```shell
#Tue Mar 11 20:07:08 CST 2025
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.11.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```


终于下载好后，修改下代码运行
![Android Studio的部署-202503112052](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/Android%20Studio%E7%9A%84%E9%83%A8%E7%BD%B2-202503112052.png)

到这里也是结束了
