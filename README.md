# livego-frontend

适用于 [gwuhaolin/livego](https://github.com/gwuhaolin/livego) 的前端部分

## 设置环境

```dotenv
VUE_APP_FLV_PATH="http://192.168.123.101:7001"
VUE_APP_HLV_PATH="http://192.168.123.101:7002"
```

需要始终启用 `flv`，因为需要用到flv的数据（`/streams` 接口）

## 配置参考

- iptables 处理端口

    ```shell
    iptables -A INPUT -s 127.0.0.1 -p tcp --dport 6379 -j ACCEPT
    iptables -A INPUT -s 127.0.0.1 -p tcp --dport 7001 -j ACCEPT
    iptables -A INPUT -s 127.0.0.1 -p tcp --dport 7002 -j ACCEPT
    iptables -A INPUT -s 127.0.0.1 -p tcp --dport 8090 -j ACCEPT
    iptables -A INPUT -p TCP --dport 6379 -j REJECT
    iptables -A INPUT -p TCP --dport 7001 -j REJECT
    iptables -A INPUT -p TCP --dport 7002 -j REJECT
    iptables -A INPUT -p TCP --dport 8090 -j REJECT
    ```
  
- nginx 配置（代理接口及视频），需要注意的是 `8090` 端口会暴露敏感信息，需要自行决定是否代理

    ```editorconfig
    location ~ (.*\.(flv)$|/streams) {
      # 此处可能需要添加http auth防止破坏
      proxy_pass  http://127.0.0.1:7001;
      proxy_set_header Host $proxy_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ .*\.(m3u8|ts)$ {
      proxy_pass  http://127.0.0.1:7002;
      proxy_set_header Host $proxy_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    #location ~ /(control|stat) {
    #  # 此处可能需要添加http auth防止破坏
    #  proxy_pass  http://127.0.0.1:8090;
    #  proxy_set_header Host $proxy_host;
    #  proxy_set_header X-Real-IP $remote_addr;
    #  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #}
    
    location / {
      # 播放页
    }
    ``` 

- nginx（代理推流），需要安装 `ngx_stream_proxy_module` 模块，仅供参考

    ```editorconfig
    # 这层放到根nginx.conf, 跟上面那堆不一定在同一个文件
    stream {
        map $server_addr $internalport {
            example.com 1936;
        }
        server {
            listen 444;
            proxy_connect_timeout 1s;
            proxy_pass 127.0.0.1:$internalport;
        }
    }
    ```

## 后端修改参考

由于原版处理redis内容不会删除旧token，所以建议参考 [此处](https://github.com/BANKA2017/livego/commit/3aedd0e6a6a3a04dfd6d6e930d558afb8c7549de) 修改

