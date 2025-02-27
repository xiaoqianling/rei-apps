// import { ChainingHashMap } from "../../../core/dataStructure/chainingHashMap";
import { ChainingHashMap } from "@/src/core/dataStructure/chainingHashMap";
import { describe, it } from "vitest";

describe("测试数据结构: chainingHashMap", () => {
  it("测试链式哈希表", () => {
    const haspMap = new ChainingHashMap<number, string>(10);
    // console.log(haspMap);
    console.log("----------------");
    haspMap.put(1, "first");
    haspMap.put(2, "second");
    haspMap.put(3, "third");
    haspMap.put(4, "fourth");
    console.log(haspMap);
  });
});
