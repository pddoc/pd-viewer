<script setup>
import PdfViewer from "pd-viewer";

// const viewer = new PdfViewer("viewer-id");
// 以文档尺寸80%的比例渲染
const viewer = new PdfViewer("viewer-id", 0.8);

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
</script>

<template>
  <h1>PdViewer - 简单易用的pdf阅读器(基于pdfjs-dist封装)</h1>
  <h4>
    <a href="https://www.pddoc.cn" alt="pdf在线编辑器" target="_blank"
      >pdf在线编辑器：www.pddoc.cn</a
    >
  </h4>

  <input type="file" @change="doChooseFile($event)" />
  <input type="button" value="放 大" @click="doZoomIn" />&nbsp;
  <input type="button" value="缩 小" @click="doZoomOut" />&nbsp;
  <input type="button" value="上一页" @click="doPrePage" />&nbsp;
  <input type="button" value="下一页" @click="doNextPage" />
  <div id="viewer-id"></div>
</template>

<style scoped>
#viewer-id {
  width: 80%;
  height: 600px;
  border: solid 1px #888;
  background-color: #ddd;
  border-radius: 10px;
  overflow: auto;
}
</style>
