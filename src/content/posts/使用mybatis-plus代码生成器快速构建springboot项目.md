---
title: 使用mybatis代码生成器快速构建springboot项目
description: 快速构建springboot项目
categories:
  - 计算机
tags:
  - Java
  - SpringBoot
cover: https://api.mtyqx.cn/tapi/random.php
status: 已完成
date: 2025-03-22 17:35
updated: 2025-05-14 18:43
series: SpringBoot
---
[MyBatis-Plus](https://github.com/baomidou/mybatis-plus) 是一个 [MyBatis](https://www.mybatis.org/mybatis-3/) 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。
<!--more-->
## 配置
首先你的项目里需要有这三个依赖
```xml
	<!-- freemarker -->
   <dependency>
       <groupId>org.freemarker</groupId>
       <artifactId>freemarker</artifactId>
   </dependency>
   <!-- mybatis-plus -->
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-boot-starter</artifactId>
   </dependency>
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-generator</artifactId>
   </dependency>
   <!-- 以下应该也需要 -->
    <!-- web -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
```

## 编写代码生成器
`src/test/java` 路径下新建一个 `AutoCodeGenerator` 类
```java
// src/test/java
public class AutoCodeGenerator {  
    public static void main(String[] args) {  
        String url = "jdbc:mysql:///数据库名";  
        String username = "root";  
        String password = "root";  
        String author = "lanke";  
        String outputDir = "src\\main\\java";  
        String basePackage = "com.lanke";  
        String moduleName = "sys";  
        String mapperLocation = "src\\main\\resources\\mapper\\" + moduleName;  
        String tableName = "articles,users";  
        String tablePrefix = "";  
        FastAutoGenerator.create(url, username, password)  
                .globalConfig(builder -> {  
                    builder.author(author) // 设置作者  
                            //.enableSwagger() // 开启 swagger 模式  
                            //.fileOverride() // 覆盖已生成文件  
                            .outputDir(outputDir); // 指定输出目录  
                })  
                .packageConfig(builder -> {  
                    builder.parent(basePackage) // 设置父包名  
                            .moduleName(moduleName) // 设置父包模块名  
                            .pathInfo(Collections.singletonMap(OutputFile.xml, mapperLocation)); // 设置mapperXml生成路径  
                })  
                .strategyConfig(builder -> {  
                    builder.addInclude(tableName) // 设置需要生成的表名  
                            .addTablePrefix(tablePrefix); // 设置过滤表前缀  
                })  
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板  
                .execute();  
    }  
}
```
根据自己的实际情况修改参数，然后运行即可


## 修改 swagger 模式
swagger 2 已经不支持 vue 3 了，因此你要是启用自带的 swagger 在代码里会直接报错
为了让 MyBatis-Plus 代码生成器默认生成 OpenAPI3（原 Swagger3）注解，你需要 **自定义模板** 并调整生成配置。以下是详细步骤：

---

###  **步骤一：创建自定义模板**
1. 在 `resources` 目录下新建模板文件夹：  
   ```text
   src/main/resources/templates/
   ```

2. 创建自定义实体模板文件 `entity.java.ftl`，内容如下：  
```java
package ${package.Entity};

<#list table.importPackages as pkg>
import ${pkg};
</#list>
<#if swagger>
import io.swagger.v3.oas.annotations.media.Schema;
</#if>
<#if entityLombokModel>
import lombok.Data;
import lombok.EqualsAndHashCode;
</#if>

/**
 * <p>
 * ${table.comment!}
 * </p>
 */
<#if entityLombokModel>
@Data
<#if superEntityClass??>
@EqualsAndHashCode(callSuper = true)
<#else>
@EqualsAndHashCode(callSuper = false)
</#if>
</#if>
<#if swagger>
@Schema(name = "${entity}", description = "${table.comment!}")
</#if>
<#if table.convert>
@TableName("${schemaName}${table.name}")
</#if>
public class ${entity} extends Model<${entity}> {
<#-- 字段循环 -->
<#list table.fields as field>
    <#if field.keyFlag>
        <#assign keyPropertyName="${field.propertyName}"/>
    </#if>
    <#if field.comment!?length gt 0>
    /**
     * ${field.comment}
     */
    </#if>
    <#if swagger>
    @Schema(description = "${field.comment!}", example = "<#if field.type?contains('Integer')>1<#elseif field.type?contains('LocalDateTime')>2025-03-22T10:15:30<#else>示例值</#if>")
    </#if>
    private ${field.propertyType} ${field.propertyName};
</#list>
}
```

---

### **步骤二：修改代码生成器配置**
更新你的 `AutoCodeGenerator` 类：
```java
package com.lanke.editorboot;  
  
import com.baomidou.mybatisplus.generator.FastAutoGenerator;  
import com.baomidou.mybatisplus.generator.config.OutputFile;  
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;  
  
import java.util.Collections;  
  
public class AutoCodeGenerator {  
    public static void main(String[] args) {  
        String url = "jdbc:mysql:///editor";  
        String username = "root";  
        String password = "root";  
        String author = "lanke";  
        String outputDir = "src\\main\\java";  
        String basePackage = "com.lanke";  
        String moduleName = "sys";  
        String mapperLocation = "src\\main\\resources\\mapper\\" + moduleName;  
        String tableName = "articles,user";  
        String tablePrefix = "";  
        FastAutoGenerator.create(url, username, password)  
                .globalConfig(builder -> {  
                    builder.author(author) // 设置作者  
                            .enableSwagger() // 开启 swagger 模式  
                            //.fileOverride() // 覆盖已生成文件  
                            .outputDir(outputDir); // 指定输出目录  
                })  
                .templateConfig(builder -> {  
                    // 关键：指定自定义模板路径  
                    builder.entity("/templates/entity.java");  
                })  
                .packageConfig(builder -> {  
                    builder.parent(basePackage) // 设置父包名  
                            .moduleName(moduleName) // 设置父包模块名  
                            .pathInfo(Collections.singletonMap(OutputFile.xml, mapperLocation)); // 设置mapperXml生成路径  
                })  
                .strategyConfig(builder -> {  
                    builder.addInclude(tableName) // 设置需要生成的表名  
                            .addTablePrefix(tablePrefix); // 设置过滤表前缀  
                })  
                .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板  
                .execute();  
    }  
}
```

---
> PS：暂时停用，有点问题
#### **步骤三：验证生成的实体类**
生成的 `User.java` 示例：
```java
@Schema(name = "User", description = "用户表")
public class User {
    @Schema(description = "用户ID", example = "1")
    private Integer id;
    
    @Schema(description = "用户名", example = "admin")
    private String username;
}
```

---

#### **关键配置说明**
| **配置项**              | **作用**                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `.enableSwagger()`       | 启用 Swagger 注解生成开关（虽然名字是 Swagger，但通过模板控制实际生成 OpenAPI3 注解） |
| `.templateConfig()`      | 指定自定义模板路径，覆盖默认模板                                         |
| `entityBuilder().enableLombok()` | 集成 Lombok 简化代码（可选）                                            |

---

#### **模板变量说明**
| **变量**            | **说明**                 |
|---------------------|-------------------------|
| `${table.comment}`  | 表注释                   |
| `${field.comment}`  | 字段注释                 |
| `${field.propertyType}` | 字段类型（如 `String`） |
| `${field.propertyName}` | 字段名（如 `username`） |

---

#### **常见问题解决**
1. **模板不生效**  
   - 检查模板路径是否在 `resources/templates/` 下  
   - 确保模板文件名与配置一致（如 `entity.java` 对应 `entity.java.ftl`）

2. **示例值不符合类型**  
   修改模板中的 `example` 生成逻辑：
   ```ftl
   example = "<#if field.propertyType == 'Integer'>1<#elseif field.propertyType == 'LocalDateTime'>2025-03-22T10:15:30<#else>示例值</#if>"
   ```

3. **日期格式问题**  
   添加 `format` 参数：
   ```ftl
   <#if field.propertyType == 'LocalDateTime'>
   @Schema(description = "${field.comment!}", format = "date-time", example = "2025-03-22T10:15:30")
   </#if>
   ```

---

通过这种方式，MyBatis-Plus 代码生成器将默认生成符合 OpenAPI3 规范的注解，与 Knife4j 完美兼容。

## 测试
在程序入口添加一行注解 `@MapperScan("com.lanke.*.mapper")` 
包名换成自己的
![使用mybatis-plus代码生成器快速构建springboot项目-202503221808|625](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/%E4%BD%BF%E7%94%A8mybatis-plus%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E5%BF%AB%E9%80%9F%E6%9E%84%E5%BB%BAspringboot%E9%A1%B9%E7%9B%AE-202503221808.png)
在 `test/java` 里修改代码 ![使用mybatis-plus代码生成器快速构建springboot项目-202503221855|625](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/%E4%BD%BF%E7%94%A8mybatis-plus%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E5%BF%AB%E9%80%9F%E6%9E%84%E5%BB%BAspringboot%E9%A1%B9%E7%9B%AE-202503221855.png)

执行就能看见数据库里的数据被输出出来了


再写一个测试接口![使用mybatis-plus代码生成器快速构建springboot项目-202503221924|475](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/%E4%BD%BF%E7%94%A8mybatis-plus%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E5%BF%AB%E9%80%9F%E6%9E%84%E5%BB%BAspringboot%E9%A1%B9%E7%9B%AE-202503221924.png)

> PS：你的程序入口要和 sys 在同一目录下，否则会 404


运行成功![使用mybatis-plus代码生成器快速构建springboot项目-202503221932|475](https://gcore.jsdelivr.net/gh/Keduoli03/My_img@img/%E4%BD%BF%E7%94%A8mybatis-plus%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%E5%BF%AB%E9%80%9F%E6%9E%84%E5%BB%BAspringboot%E9%A1%B9%E7%9B%AE-202503221932.png)
