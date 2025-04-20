import { AlgoSource } from "@/src/components/senki/lib/algo_desc";
import makeBubbleAlgoSource from "./bubble";
import makeMergeAlgoSource from "./merge";
import makeRedBlackTreeAlgoSource from "../tree/redBlackTree";
import makeInorderTraversalAlgoSource from "../tree/inorderTraversal";

export async function getAlgo(id: string): Promise<AlgoSource | undefined> {
  switch (id) {
    case "bubble":
      return Promise.resolve(makeBubbleAlgoSource());
    case "merge":
      return Promise.resolve(makeMergeAlgoSource());
    case "tree":
      return Promise.resolve(makeInorderTraversalAlgoSource()); // TODO: "tree
    default:
      return Promise.resolve(undefined);
  }
}
