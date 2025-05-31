---
slug: 561813
title: MyBatis
description: 摘要
categories:
  - 计算机
tags:
  - 笔记
  - Java
  - SpringBoot
series: SpringBoot
cover: 
status: 未完成
date: 2025-05-28 19:59
updated: 2025-05-28 20:34
---

## 介绍
**来自官网**
MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

> 补充说明：
> 持久层框架：将数据保存到硬盘上
> Java POJO：老式 java 对象

本学期认识了一位很棒的老师，尽管她教授的是一门已经很落后的技术-JSP，但是还是给我们讲解了很多底层的知识，非常受用，本篇由此而来，算是从会用->原理的进步吧。

在之前，Java 如果想连接数据库的话，是需要借助 JDBC 这个东西的。JDBC是Java DataBase Connectivity的缩写，它是Java程序访问数据库的标准接口。

使用Java程序访问数据库时，Java代码并不是直接通过TCP连接去访问数据库，而是通过JDBC接口来访问，而JDBC接口则通过JDBC驱动来实现真正对数据库的访问，而 JDBC驱动由厂商提供，这里不多赘述。

JDBC 连接数据库的基本步骤一般是：

1. **加载 JDBC 驱动程序**：根据数据库类型加载相应的驱动程序
2. **建立数据库连接**：通过 URL、用户名和密码连接到数据库
3. **创建 Statement 对象**：用于执行 SQL 语句
4. **执行 SQL 语句**：执行查询或更新操作
5. **处理结果集**：如果是查询操作，处理返回的结果集
6. **关闭资源**：依次关闭 ResultSet、Statement 和 Connection

在实践中，为了方便开发，要单独写一个工具类来实现 jdbc 的配置，但是仍有很多不便，所以就有了 MyBatis。

## 安装

在 `pom.xml` 中引入以下依赖代码

```xml
```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```

在 [Github](https://github.com/mybatis/mybatis-3) 中可以查看最新的版本

### 配置

可以通过 properties 属性来实现引用配置文件

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置（即 `properties.xml`）

```xml title="properties.xml"
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useSSl=trur&amp;sueUnicode=true&amp;characterEncoding=UTF-8&amp; serverTimezone=Asia/Shanghai
username=root
password=root
```

## MyBatis-Plus

详见我的另一篇博客：[使用mybatis代码生成器快速构建springboot项目](https://www.blueke.top/posts/%E4%BD%BF%E7%94%A8mybatis-plus%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E5%BF%AB%E9%80%9F%E6%9E%84%E5%BB%BAspringboot%E9%A1%B9%E7%9B%AE/#%E6%B5%8B%E8%AF%95)
