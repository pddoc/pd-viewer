# pd-viewer - 简单易用的 pdf 阅读器(基于 pdfjs-dist 封装)

> #### pdf 在线编辑器：[www.pddoc.cn](http://www.pddoc.cn)

## 安装方法

```javascript
npm install pd-viewer
```

## 使用方法

```javascript
import PdfViewer from "pd-viewer";

const viewer = new PdfViewer("viewer-id");
// 显示网络文件
viewer.render("./a.pdf");

// 显示本地文件
const doChooseFile = (e) => {
  const file = e.target.files[0];
  viewer.render(file);
};
// 放大
const doZoomIn = () => {
  viewer.zoomIn();
};
// 缩小
const doZoomOut = () => {
  viewer.zoomOut();
};

// 上一页
const doPrePage = () => {
  viewer.goPrePage();
};
// 下一页
const doNextPage = () => {
  viewer.goNextPage();
};
```

### 具体示例见 vue-demo 文件夹
