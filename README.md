<img src="http://i.imgur.com/xvSJqno.png" align="right"/>

### [View Demo Page From GAE](https://appforncu.appspot.com/)

### 三個html檔案都在app/Map/view裡面
```
1. map.html     對應 public/resource/leafletMap
2. event.html   對應 public/resource/eventHTML
3. traffic.html 對應 public/resource/trafficHTML
```

### 個別資料夾裡面僅放與其密切相關文件
```
- 全域涵式庫(JQuery,Bootstrap...)放置於/public/vende
- 全域工具庫(Parser,StringFormat)放置於/public/script/tool
```

### 全域工具庫須知
```
- Parser與ModuleController用不到
- ResourceController於event.html  使用
- StringFormat      於traffic.html使用
```



