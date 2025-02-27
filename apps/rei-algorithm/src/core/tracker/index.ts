class ExecutionSandbox {
  constructor(config) {
    this.snapshots = [];
    this.currentStep = 0;

    // 创建代理环境
    this.env = new Proxy(
      {},
      {
        get: (target, prop) => {
          // 拦截链表创建方法
          if (prop === "LinkedList") {
            return {
              createCyclicHead: (arr, index) => this.wrapLinkedList(arr, index),
            };
          }
          return target[prop];
        },
      },
    );
  }

  // 包装链表节点
  wrapLinkedList(arr, cycleIndex) {
    const nodes = arr.map((val) => ({
      val,
      next: null,
      __tracked: true,
    }));

    // 创建循环引用
    nodes.forEach((node, i) => {
      node.next = nodes[i + 1] || nodes[cycleIndex];
    });

    // 代理节点访问
    return new Proxy(nodes[0], {
      get(target, prop) {
        return prop === "next" ? this.trackNext(target) : target[prop];
      },
    });
  }

  takeSnapshot(stepInfo) {
    this.snapshots.push({
      step: this.currentStep++,
      variables: this.captureState(),
      codePosition: stepInfo.loc,
    });
  }
}
