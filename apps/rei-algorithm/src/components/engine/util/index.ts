import plugin from "../lib/babel/plugin-senki-wait";
import { transform } from "@babel/standalone";
import { CodeControl, CodeContext } from "../lib/algo_desc";
import { Scene, ReiLinkedNode } from "../lib/engine";

export function makeCodeSource(code: string, format: boolean) {
  code = code.split("\n").slice(2).join("\n").trim();
  let error = "",
    fakeCode = code,
    realCode = "";

  try {
    if (format) fakeCode = transform(code, {}).code!;

    realCode = transform(fakeCode, {
      plugins: [plugin],
    }).code!;
  } catch (err) {
    // error = err;
    console.error(err);
  }

  return { fakeCode, error, realCode };
}

export const createNewCodeControl = (
  // 代码字符串
  realCode: string,
  statusRef: React.MutableRefObject<"stop" | "play" | "finish">,
  setStatus: (bool: "stop" | "play" | "finish") => void,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  // 设置高亮位置
  setCodeInfo: (a: [number, number]) => void,
  scene: Scene,
  tempTask: undefined | (() => void), // 保存断点继续的执行函数
): CodeControl => {
  let codeControl = new CodeControl(realCode);

  const handleWait = ({ info, resolve }: CodeContext) => {
    setCodeInfo(info.line);
    // 确定动画结束了再进行下一步
    const tryToNext = () => {
      if (statusRef.current === "play") {
        if (scene.isAnimAllOver()) resolve();
        else setTimeout(tryToNext, 100);
      } else tempTask = resolve;
    };

    setTimeout(tryToNext, 500);
  };

  const handleEnd = () => {
    setStatus("finish");
    setCodeInfo([-1, -1]);
  };

  const handleDestroy = () => {
    scene.removeAllChild();
    ReiLinkedNode.senkiForest.destroyTree();
    ReiLinkedNode.resetSenkiForest();
    scene.add(ReiLinkedNode.senkiForest);
  };

  const handleError = (err: string) => {
    setError(err);
  };

  codeControl.on("wait", handleWait);
  codeControl.on("end", handleEnd);
  codeControl.on("destroy", handleDestroy);
  codeControl.on("error", handleError);

  codeControl.start();
  return codeControl;
};
