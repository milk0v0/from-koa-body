## 前言

+ 写了一个小 demo ，用 `koa-body` 接收处理请求信息，这次直接用 `from` 表单接收，也顺便算是回故吧
+ [demo地址](https://github.com/milk0v0/from-koa-body)



## from表单

+ 其实这块没什么好说的，在很久之前，可能大概是我小学的时候吧，记得网页上填写东西都是用 `from` 提交信息，现在大多都使用 `ajax` 或者 JQ 的 `$ajax` 又或者是 `axios` 库之类的，大概回忆一下吧
+  `<from>` 是一个标签，用于提交用户表单，也就是 `<input>`
+ 有几个 `attribute` 需要记一下
  1. `action` - 规定当提交表单时向何处发送表单数据（也就是填写提交地址）
  2. `method` - 规定用于发送 form-data 的 HTTP 方法（post、get）
  3. `enctype` - 规定在发送表单数据之前如何对其进行编码
     - `application/x-www-form-urlencoded` - 把数据组织成 urlencode的格式
       - 表现形式为 key=value&key=value...
       - 适用于普通字符内容提交，提交的数据为纯字符
     - `multipart/form-data` - 二进制数据格式
       - 适用于提交的数据为非纯字符，如图片，视频等
     - `text/plain` -  纯文本提交
+ `<form>` 内的 `<input>` 使用 `name` 区分
+ 使用 `<input type="submit">` 提交

```html
<form method="POST" action="/post" enctype="multipart/form-data">
    <p>名字: <input type="text" name="name" /></p>
    <p>密码: <input type="password" name="password" /></p>
    <input type="file" name="file">
    <input type="submit" value="Submit" />
</form>
```



## koa-body

+ `koa-body` 是 `koa` 的一个正文解析器中间件
+ 他参考了 `multer` 模块，并加了点扩充功能



### 特性

+ 可以处理
  + **multipart/form-data**
  + **application/x-www-urlencoded**
  + **application/json**
  + **application/json-patch+json**
  + **application/vnd.api+json**
  + **application/csp-report**
  + **text/xml**
+ 不一定需要 `koa` 支持，也可以直接使用 `node` 
+ 支持文件上传
+ 支持正文、字段和文件大小限制



### 安装

```sh
npm install koa-body
```



### 简单示例

```javascript
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody());
app.use(ctx => {
    console.log(ctx.request.body);
    ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
});

app.listen(8080);
```



### 与 `koa-router` 搭配使用

+ 与 `koa-router` 搭配可以使得：你想只在什么接口使用解析器，就在该路由下使用就可以

```javascript
const Koa = require('koa');
const app = new Koa();
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const router = new KoaRouter();

router.post('/post', koaBody(), ctx => {
    console.log(ctx.request.body);
    ctx.body = JSON.stringify(ctx.request.body);
});

app.use(router.routes());

app.listen(8080);
```



### 可选配置项

+ `patchNode`{Boolean} - 将请求正文修补到Node的 `ctx.req` - 默认 `false`
+ `patchKoa`{Boolean} - 将请求正文修补到 `koa` 的 `ctx.request` - 默认 `true`
+ `jsonLimit`{String | Integer} - JSON主体的字节限制 - 默认 `1mb`
+ `formLimit`{String | Integer} - 表单主体的字节限制 - 默认 `56kb`
+ `textLimit`{String | Integer} - 文本主体的字节 - 默认 `56kb`
+ `encoding`{String} - 设置传入表单字段的编码 - 默认 `utf-8`
+ `multipart`{Boolean} - 解析多部分实体（例如`form-data`） - 默认 `false`
+ `urlencoded`{Boolean} - 解析默认编码的正文 - 默认 `false`
+ `text`{Boolean} - 默认解析文本主体，例如XML - 默认 `true`
+ `json`{Boolean} - 解析JSON主体 - 默认 `true`
+ `jsonStrict`{Boolean} - 切换严格模式，如果设置为true-仅解析数组或对象 - 默认 `true`
+ `includeUnparsed`{Boolean} - 切换 returnRawBody 选项，如果设置为true，则对于表单 encodedand 和JSON 请求，将 `ctx.request.body` => `Symbol` - 默认附加未解析的原始请求体`false`
+ `formidable`{Object} - 传递给强大的多部分解析器的选项
  + `maxFields`{Integer} - 限制查询字符串解析器将解码的字段数 - 默认 `1000`
  + `maxFieldsSize`{Integer} - 限制所有字段（文件除外）可一起分配的内存量（以字节为单位）如果超过该值，默认情况下会发出 `error` 事件 `2mb (2 * 1024 * 1024)`
  + `uploadDir`{String} - 设置用于放置文件上传的目录 - 默认情况下 `os.tmpDir()`
  + `keepExtensions`{Boolean} - 写入的文件 `uploadDir` 将包括原始文件的扩展名，默认情况下 `false`
  + `hash`{String} - 如果要为传入文件计算校验和，请将其设置为 `'sha1'` 或 `'md5'` - 默认 `false`
  + `multiples`{Boolean} - 默认上传多个文件或不上传 - 默认 `true`
  + `onFileBegin`{Function} - 文件上传开始的回调，他能直接执行，用于重命名文件，然后再将其保存在磁盘。[查看文档](https://github.com/felixge/node-formidable#filebegin)
+ `onError`{Function} - 自定义错误句柄，如果抛出错误，则可以自定义响应-onError（error，context）- 默认会抛出
+ `parsedMethods`{String[]} - 声明用于解析正文的HTTP方法 - 默认为`['POST', 'PUT', 'PATCH']`



### 解析正文获取

+ `ctx.request.body` - 除 `files` 外的正文
+ `ctx.request.files` - 上传的文件
