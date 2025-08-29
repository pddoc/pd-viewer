import * as pdfjsLib from "pdfjs-dist";

import createLoadObserver from "./loadObserver";

class PdfViewer {
  #wraperId;
  #wraper;

  #safeObserve;
  #disposeObserver;

  pdf;

  #scale;

  #pageHeights = [];
  #pageOffsetTops = [];

  #currentPageNum;

  constructor(domId, scale = 1) {
    this.#wraperId = domId;
    this.#scale = scale;
    const that = this;

    const { safeObserve, disposeObserver } = createLoadObserver(
      (pageDom) => {
        const num = pageDom.getAttribute("_pnum");
        that.#currentPageNum = parseInt(num);
      },
      (pageDom) => {
        const num = pageDom.getAttribute("_pnum");
        const newNum = parseInt(num) + 1;
        if (newNum <= that.pdf.numPages) {
          that.loadPage(newNum);
        }
      }
    );

    this.#safeObserve = safeObserve;
    this.#disposeObserver = disposeObserver;
  }

  async loadPdf(pdfFile) {
    let loadingTask;
    if (typeof pdfFile == "string") {
      loadingTask = pdfjsLib.getDocument(pdfFile);
    } else {
      const arrayBuffer = await pdfFile.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
      });
    }

    return await loadingTask.promise;
  }

  async loadPage(num = 1) {
    const page = await this.pdf.getPage(num);
    const viewport = page.getViewport({ scale: 1.333 });
    const outputScale = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    const w = Math.floor(viewport.width);
    const h = Math.floor(viewport.height);
    canvas.width = Math.floor(w * outputScale);
    canvas.height = Math.floor(h * outputScale);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.style.margin = "0 auto 20px";
    canvas.style.display = "block";
    canvas.setAttribute("_w", w);
    canvas.setAttribute("_h", h);
    canvas.setAttribute("_pnum", num);
    this.#safeObserve(canvas);
    if (!this.#wraper) {
      this.#wraper = document.getElementById(this.#wraperId);
      this.#wraper.style.position = "relative";
    }
    this.#wraper.append(canvas);
    let newH = h;
    if (this.#scale != 1) {
      const { w: w1, h: h1 } = this.#zoomCanvas(canvas);
      newH = h1;
    }

    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
    const renderContext = {
      canvasContext: context,
      transform,
      viewport,
    };
    page.render(renderContext);

    if (num == 1) {
      this.#pageOffsetTops.push(0);
    } else {
      const lastT = this.#pageOffsetTops[this.#pageOffsetTops.length - 1];
      const lastH = this.#pageHeights[this.#pageHeights.length - 1];
      this.#pageOffsetTops.push(lastT + lastH + 20);
    }

    this.#pageHeights.push(newH);
  }

  async render(file) {
    this.#disposeObserver();
    if (this.#wraper) {
      this.#wraper.innerHTML = "";
    }
    this.pdf = await this.loadPdf(file);
    this.loadPage();
  }

  #xs = 1.1;
  // 放大
  zoomIn() {
    this.#scale = this.#scale * this.#xs;
    console.log("放大", this.#scale);
    this.#zoom();
  }
  // 缩小
  zoomOut() {
    this.#scale = this.#scale / this.#xs;
    console.log("缩小", this.#scale);
    this.#zoom();
  }
  #zoom() {
    const canvasEles = document
      .getElementById(this.#wraperId)
      .querySelectorAll("canvas");
    canvasEles.forEach((item, idx) => {
      const { w, h } = this.#zoomCanvas(item);
      this.#pageHeights[idx] = h;
    });

    this.#updatePageOffsetTops();
  }
  #zoomCanvas(canvas) {
    const w = Math.floor(parseFloat(canvas.getAttribute("_w")) * this.#scale);
    const h = Math.floor(parseFloat(canvas.getAttribute("_h")) * this.#scale);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    return { w, h };
  }
  #updatePageOffsetTops() {
    this.#pageOffsetTops.map((t, idx) => {
      if (idx > 0) {
        const lastT = this.#pageOffsetTops[idx - 1];
        const lastH = this.#pageHeights[idx - 1];
        this.#pageOffsetTops[idx] = lastT + lastH + 20;
      }
    });
  }

  goPrePage() {
    if (this.#currentPageNum == 1) {
      return;
    }
    const newPageNum = this.#currentPageNum - 1;
    const scrollTop = this.#pageOffsetTops[newPageNum - 1];
    this.#wraper.scrollTop = scrollTop;
  }

  goNextPage() {
    if (this.#currentPageNum >= this.#pageHeights.length) {
      this.#wraper.scrollTop = 0;
      return;
    }
    const scrollTop = this.#pageOffsetTops[this.#currentPageNum];
    console.log("next", scrollTop, this.#pageOffsetTops, this.#currentPageNum);
    this.#wraper.scrollTop = scrollTop;
  }
}

export default PdfViewer;
