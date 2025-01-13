import { execSync } from "child_process";
import { get } from "http";
import path from "path";

/**
 * 获取工作区和暂存区和上一次提交之间差异的文件
 * @param cwd 文件根目录
 * @returns 所有改变文件的绝对路径
 */
const getChangeFiles = async (cwd: string = process.cwd()) => {
  try {
    // https://stackoverflow.com/questions/5237605/how-can-i-run-git-status-and-just-get-the-filenames
    const lines = await execSync("git status --porcelain | cut -c4-", {
      cwd,
      encoding: "utf8",
    });
    if (!lines) {
      return [];
    }
    return lines
      .split("\n")
      .filter((i) => i)
      .map((file) => path.resolve(cwd, file));
  } catch (e) {
    return [];
  }
};

const parseChangesetArgv = () => {
  console.log("process.argv", process.argv);
  const typeArg = process.argv.find((a) => a.startsWith("type="));
  const targetArg = process.argv.find((a) => a.startsWith("target="));
  const msgArg = process.argv.find((a) => a.startsWith("msg="));
  const useAutoMsg = Boolean(
    process.argv.find((a) => a.startsWith("msg_auto=")),
  );
  const type = typeArg ? typeArg.split("=")[1] : "changed";
  const target = targetArg ? targetArg.split("=")[1] : "develop";
  const msg = msgArg ? msgArg.split("=")[1] : "";
  const isAll = process.argv.includes("--all");
  return {
    type,
    target,
    msg,
    useAutoMsg,
    isAll,
  };
};

parseChangesetArgv();
