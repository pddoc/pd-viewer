const getId = () => {
  const alphabet =
    "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  return Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((v) => alphabet[v % alphabet.length])
    .join("");
};

const createLoadObserver = (event, onceEvent) => {
  const id = `lo_${getId()}`;
  const observedElements = new Set(); // 存储被观察元素的集合
  // 创建观察者
  const lazyLoadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (event) {
            event(element);
          }
          if (onceEvent && !element.getAttribute(id)) {
            onceEvent(element);
            element.setAttribute(id, 1);
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  // 封装观察方法
  const safeObserve = (element) => {
    if (!observedElements.has(element)) {
      lazyLoadObserver.observe(element);
      observedElements.add(element);
    }
  };

  return {
    safeObserve,
    disposeObserver: () => {
      observedElements.forEach((ele) => {
        lazyLoadObserver.unobserve(ele);
      });
      observedElements.clear();
    },
  };
};

export default createLoadObserver;
