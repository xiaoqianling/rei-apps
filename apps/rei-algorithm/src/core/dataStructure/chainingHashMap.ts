// 修改桶类型定义，明确键值对类型
type Bucket<K extends Key, V> = Array<[K, V]>;
type Key = number | string;

export class ChainingHashMap<K extends Key, V> {
  private table: Array<Bucket<K, V>>; // 明确数组元素类型
  private size: number;

  constructor(private capacity: number) {
    // 修复初始化问题：避免所有bucket共享同一个数组引用
    this.table = Array.from({ length: capacity }, () => []);
    this.size = 0;
  }

  // 优化哈希函数，支持字符串键
  private hash(key: K): number {
    if (typeof key === "number") return key % this.capacity;

    // 字符串哈希计算优化
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
    }
    return Math.abs(hash) % this.capacity;
  }

  put(key: K, value: V) {
    const index = this.hash(key);
    const bucket = this.table[index];

    // 使用some提前终止查找
    const exist = bucket.some((pair) => {
      if (pair[0] === key) {
        pair[1] = value;
        return true;
      }
    });

    if (!exist) {
      bucket.push([key, value]); // 修复：应存储键值对元组
      this.size++;

      // 添加扩容阈值检测
      if (this.size > this.capacity * 0.75) {
        this.resize(this.capacity * 2);
      }
    }
  }

  // 补充完整的resize实现
  private resize(newCapacity: number) {
    const oldTable = this.table;
    this.capacity = newCapacity;
    this.table = Array.from({ length: newCapacity }, () => []);
    this.size = 0;

    oldTable.forEach((bucket) => {
      bucket.forEach(([key, value]) => {
        this.put(key, value);
      });
    });
  }

  // ... 保持其他方法不变 ...
  get(key: K): V | undefined {
    const index = this.hash(key);
    const bucket = this.table[index];

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  remove(key: K) {
    const index = this.hash(key);
    const bucket = this.table[index];

    this.table[index] = bucket.filter(([k]) => k !== key);
    this.size--;
  }

  // 获取整个存储结构（供TrackedHashMap使用）
  getTable(): Bucket<K, V>[] {
    return this.table.map((bucket) => [...bucket]); // 返回拷贝
  }
}
