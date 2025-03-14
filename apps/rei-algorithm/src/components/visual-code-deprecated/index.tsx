import { FunctionComponent } from "react";
import styles from "./index.module.scss";
import VisualItem from "./visualItem";
import { VisualItemType } from "./visualItem/type";

interface VisualCodeProps {}

/**
 *界面交互模块需要整合代码编辑器和可视化面板，可能使用类似CodeMirror或Monaco的编辑器库，
 以及D3.js或React Flow等可视化库。
 用户应该能够编辑代码，点击运行后，解析器处理代码，数据追踪器记录步骤，
 然后用户可以通过步进按钮逐步查看可视化变化
 */

const VisualCode: FunctionComponent<VisualCodeProps> = () => {
  const code = `var detectCycle = function(head) {
    let fast, slow;
    fast = slow = head;
    // @visualize color slow #99CCFF
    // @visualize color fast #99CC66
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        // 点击下面这一行代码，即可看到快慢指针追逐相遇
        if (fast == slow) break;
    }

    if (fast == null || fast.next == null) {
        // fast 遇到空指针说明没有环
        return null;
    }

    // 重新指向头结点
    slow = head;
    // 点击下面这一行代码，即可看到快慢指针同步前进，相交点就是环起点
    while (slow != fast) {
        fast = fast.next;
        slow = slow.next;
    }
    return slow;
};

let head = LinkedList.createCyclicHead([1,3,5,7,2,4], 2)
let result = detectCycle(head)`;

  return (
    <div className={styles.wrapper}>
      Visual Code:
      <div className={styles.container}>
        <header className={styles.header}>算法可视化实例</header>
        <div className={styles.operations}>暂停 步进 重置 进度条...</div>
        <div className={styles.main}>
          <div className={styles.left_container}>
            <div className={styles.left_header}>很复杂的容器...</div>
            <div className={styles.code_container}>
              <pre className={styles.code}>{code}</pre>
            </div>
          </div>
          <div className={styles.visual_container}>
            <VisualItem
              type={VisualItemType.Rectangle}
              label={"123"}
              color={""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCode;
