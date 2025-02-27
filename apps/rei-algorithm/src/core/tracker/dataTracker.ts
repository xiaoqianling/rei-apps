import { cloneDeep } from "lodash";
import { ChainingHashMap } from "../dataStructure/chainingHashMap";

// 哈希表代理类（需继承你的ChainingHashMap）
export class TrackedHashMap extends ChainingHashMap {
  private history: any[] = [];

  put(key: any, value: any) {
    super.put(key, value);
    this.recordSnapshot("put", [key, value]);
  }

  remove(key: any) {
    super.remove(key);
    this.recordSnapshot("remove", [key]);
  }

  private recordSnapshot(method: string, args: any[]) {
    this.history.push({
      method,
      args,
      table: cloneDeep(this.getTable()), // 需要实现深拷贝
    });
  }
}
