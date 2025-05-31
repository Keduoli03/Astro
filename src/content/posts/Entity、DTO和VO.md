---
title: Entity、DTO和VO
description: 一点笔记记录
categories:
  - 计算机
tags:
  - 笔记
  - 后端
  - SpringBoot
series: SpringBoot
cover: 
status: 未完成
date: 2025-05-30 20:35
updated: 2025-05-31 22:54
slug: 894321
---
---

最近在写一个新的项目，因为打算做的正式点，不能像之前那样只是个自娱自乐的玩具，所以安全性这方面就需要注意一下。

## Entity 实体类

对应数据库表的领域模型，包含完整的业务属性和关系。简单来说，它与数据库表的属性一一对应，包括这些属性的 get 和 set 方法都在其中定义。

综上，它的核心特点就是**数据持久化**

我之前为了省事，都是直接通过 entity 来操作数据库的，那么这就带来了一个问题，使用 entity 会将数据库中所有的字段一并返回给前端，那如果我要实现修改用户信息，这样在前后端之间进行数据交换的操作时，就会很容易暴露 entity 类，进而导致密码等重要参数的暴露。

为了解决这种安全性问题，那我们就要借助 DTO 和 VO 来对 Entity 进行解耦，只返回所需的字段。

DTO 和 VO 的区别主要是：DTO 用于**数据交换**，VO 用于**展示数据**

## DTO

DTO 是一种用于在不同层次（如前端与后端、服务层与数据访问层）之间传输数据的对象，通常包含简单的字段和 getter/setter 方法，不包含业务逻辑。这里的业务逻辑指的是**与业务规则、流程直接相关的代码**，即数据的校验、处理。

DTO 的核心职责是**数据传输**。在 DTO 中可以将 Entity 类中的我们想操作的字段单独拿出来，防止其他字段的泄露。比如我想实现一个展示用户信息的接口，那为了避免密码这种重要字段的泄露，我们就可以在 DTO 中单独将用户信息的部分进行定义。

```java title="UserDTO"
public class UserDTO {
    private Long id;
    private String username;
    private String email;
}
```

当然，虽然原则上 DTO 只能进行数据传输，但实际上现在还有很多的注解，可以帮助我们进行数据的校验，比如 `@NotNull`。

## VO

VO 是一种专门为**前端视图展示**设计的数据对象，它将后端的业务数据转换为前端易于处理的格式。VO 通常包含从多个领域模型或 DTO 组合而来的数据，不包含业务逻辑。

VO 的核心特点是**视图展示**。虽然它不能用于数据传输，但是在展示数据这方面更加友好。

```java title="UserVO"
public class UserVO {  
    @Schema(description = "用户ID")  
    private Long id;  
  
    @Schema(description = "用户名")  
    private String username;  
  
    @Schema(description = "昵称")  
    private String nickname;  
  
    @Schema(description = "手机号")  
    private String phone;  
  
    @Schema(description = "邮箱")  
    private String email;  
  
    @Schema(description = "简介")  
    private String introduction;  
  
    @Schema(description = "头像URL")  
    private String avatarUrl;  
  
    @Schema(description = "角色：ADMIN(管理员)，USER(普通用户)")  
    private String role;  
  
    @Schema(description = "状态：0-禁用，1-启用")  
    private Integer status;  
  
    @Schema(description = "创建时间")  
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  
    private LocalDateTime createdAt;  
  
    @Schema(description = "最后活跃时间")  
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")  
    private LocalDateTime lastActiveAt;  
}
```

## 实践

在实践中，我是将 DTO 和 VO 组合起来使用的，就比如说上面的，我先用 DTO 获取前端的传来的字段，再根据此字段数据进行处理，将结果以定义好的 UserVO 返回。
