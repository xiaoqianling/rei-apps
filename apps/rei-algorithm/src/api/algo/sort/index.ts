import { AlgoSource } from "@/src/components/senki/lib/algo_desc";
import makeBubbleAlgoSource from "./bubble";
import makeMergeAlgoSource from "./merge";

export function getAlgo(id: string): Promise<AlgoSource | undefined> {
  switch (id) {
    case "bubble":
      return Promise.resolve(makeBubbleAlgoSource());
    case "merge":
      return Promise.resolve(makeMergeAlgoSource());
    default:
      return Promise.resolve(undefined);
  }
}
