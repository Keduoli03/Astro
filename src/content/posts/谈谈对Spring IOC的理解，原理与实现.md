---
title: 谈谈对Spring IOC的理解，原理与实现
description: 第一道
categories:
  - 计算机
tags:
  - 后端
  - 面试
  - SpringBoot
series: Java面试
cover: 
status: 未完成
date: 2025-05-12 11:30
updated: 2025-05-13 17:49
---
答题技巧：采取总分的形式
总：当前问题回答的是哪些具体的点
分：以 1，2... 等的方式分细节描述相关的知识点，如果有哪些点不清楚，直接忽略过去。突出一些技术名词(核心概念、接口、类、关键方法)
避重就轻：回答自己会的，所以要尽量提到自己会的点
一个问题能占用面试官多少**时间**

回到本题，IOC 牵涉到两个重要的概念：**控制反转**、**容器**

**总：**
## 控制反转
> [!NOTE] 笔记
> 原来对象是由使用者来进行控制，需要手动创建，有了 spring 后，可以把整个对象交给 spring 来帮我们进行管理 DI: 依赖注入，把对应的属性注入到具体的对象中，比如 `@Autowired`、`populateBean` 完成属性值的注入
## 容器
> [!NOTE] 笔记
> 存储对象，使用 map 结构来存储，在 spring 一般存在三级缓存，singletonObjects 存放完整的 bean 对象，整个 bean 的生命周期，从创建到使用再到销毁全部都是由容器来管理的(bean 的声明周期)

> PS：三级缓存：解决循环依赖、bean 的生命周期

**分：**
1. 一般聊 ioc 容器要涉及到容器的创建过程(**beanFactory**，**DefaultListableBeanFactory**), 向 bean 工厂中设置一些参数(BeanPostProcessor，Aware 接口的子类) 等等属性
2. 加载解析 bean 对象，准备要创建的 bean 对象的定义对象 beanDefinition，(xml 或者注解的解析过程)
3. BeanPostProcessor 的处理，此处是扩展点(spring 生态好就是因为有很多扩展点)。PlaceHolderConfigurSupport，ConfigurationClassPostProcessor
4. BeanPostProcessor 的注册方式，方便后续对 bean 对象完成具体的拓展功能
5. 通过反射的方式讲 BeanDefinition 对象实例化成具体的 bean 对象
6. bean 对象的初始化过程(填充属性，调用 aware 子类的方法，调用 BeanPostProcessor 前置处理方法，调用 init-method 方法，调用 BeanPostProcessor 的后置处理方法)
7. 生成完整的 bean 对象，通过 getBean 方法可以直接获取
8. 销毁过程

如果记不住: 

具体的细节记不太清了，但是 spring 中的 bean 都是通过反射的方式生成的，同时其中包含了很多的拓展点，比如最常用的对象 BeanFactory 的拓展，对 bean 的拓展(对占位符的处理)，除此之外，ioc 最核心的也就是填充具体 bean 的属性和生命周期。(一定要背的点)

最后记得结束一下: 面试官，这是我对 ioc 的整体理解，您看下还有什么问题，可以指点我一下




## 拓展
> [!TIP]
> 涉及到源码... 都不会呀！慢慢学吧
>  


下
