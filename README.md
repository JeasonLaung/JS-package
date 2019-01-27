# 对JS原生的一些封装
********************
## 1.对websocket的类一些使用
``websocket.js``
```javascript
let ws = new socket({
  //网址（端口是我下面的服务器的端口）
  'url':'ws://127.0.0.1:8001',
  //心跳时间（单位:ms）
  //'heartBeat':5000,
  //发送心跳信息（支持json传入）(这个一般内容不重要，除非后端变态)
  //'heartMsg':'hello',
  //开起重连
  //'reconnect':true,
  //重连间隔时间（单位:ms）
  //'reconnectTime':5000,
  //重连次数
  //'reconnectTimes':10
})


//发送信息
ws.send({msg:'你好'})

//关闭连接
ws.close()

//心跳事件
ws.onheartbeat(()=>{
  console.log('heartbeat')
})

//心跳事件
ws.onreconnect(()=>{
  console.log('reconnect')
})

//接收信息
ws.onmessage((data)=>{
  console.log(data)
})

//关闭事件
ws.onclose((event)=>{
  console.log(event)
})

//开启事件
ws.onopen((event)=>{
  console.log(event)
})

//异常事件
ws.onopen((event)=>{
  console.log(event)
})

//更甚至可以直接拿出websocket来用（不推荐）
ws.ws.send('你好')

```
## 2.对validate的类一些使用（类似TP5的验证器）😂
提供的验证类型：

``email``邮箱验证
``mobile``手机验证
``ip``ip验证
``num``只能是数字
``numAlpha``一定要含有数字和字母
``numOrAlpha``一定要含有数字或字母
``require``有值
``max``最大字符串
``min``最小字符串
``len``长度
``Reg``正则
``before``在时间之前
``after``在时间之后
``between``在时间段之间

```javascript
//直接创建使用
new validate({
  "用户名|require().email()":"1111@qq.com",//真实数据
  "密码|require().numAlpha()":"1111@qq.com",//真实数据
}).then(()=>{
  //验证成功
  //success code
}).catch((e)=>{
  //验证失败
  //console.log(e)
})

//创建实例后使用
var validator = new validate();
validator.check({
  "用户名|require().email()":"1111@qq.com",//真实数据
  "密码|require().numAlpha()":"1111@qq.com",//真实数据
}).then(()=>{
  //验证成功
  //success code
}).catch((e)=>{
  //验证失败
  //console.log(e)
})
```
