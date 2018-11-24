# cli

```
cluster对象
cluster的各种属性和函数

cluster.setttings:配置集群参数对象
cluster.isMaster:判断是不是master节点
cluster.isWorker:判断是不是worker节点
Event: 'fork': 监听创建worker进程事件
Event: 'online': 监听worker创建成功事件
Event: 'listening': 监听worker向master状态事件
Event: 'disconnect': 监听worker断线事件
Event: 'exit': 监听worker退出事件
Event: 'setup': 监听setupMaster事件
cluster.setupMaster([settings]): 设置集群参数
cluster.fork([env]): 创建worker进程
cluster.disconnect([callback]): 关闭worket进程
cluster.worker: 获得当前的worker对象
cluster.workers: 获得集群中所有存活的worker对象
worker对象
worker的各种属性和函数：可以通过cluster.workers, cluster.worket获得。

worker.id: 进程ID号
worker.process: ChildProcess对象
worker.suicide: 在disconnect()后，判断worker是否自杀
worker.send(message, [sendHandle]): master给worker发送消息。注：worker给发master发送消息要用process.send(message)
worker.kill([signal='SIGTERM']): 杀死指定的worker，别名destory()
worker.disconnect(): 断开worker连接，让worker自杀
Event: 'message': 监听master和worker的message事件
Event: 'online': 监听指定的worker创建成功事件
Event: 'listening': 监听master向worker状态事件
Event: 'disconnect': 监听worker断线事件
Event: 'exit': 监听worker退出事件


// https://www.jianshu.com/p/2e04bca6d0c5
在主进程中 cluster 表示主进程(用于监听、发送事件), process 是本身的进程，worker 表示子进程，通过 cluster.workers 获取
在子进程中 process 表示子进程(用于监听、发送事件),也可以通过 cluster.worker 表示当前子进程
cluster.worker.process 等价于 process(在子进程中)


// http://wiki.jikexueyuan.com/project/nodejs/cluster.html
```