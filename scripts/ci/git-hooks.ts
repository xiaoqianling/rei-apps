/**
 * 貌似是AI生成的
 */

import { execSync } from "child_process";
const readCommitMessages = require("@commitlint/read").default;
import childProcess from "child_process";
// import fs from "fs-extra";
// import { packages as packages4json } from "../../eden.monorepo.json";
// import { packages as packages4js } from "../../eden.mono.config";
import path from "path";
// const _packages = [...packages4json, ...packages4js];

const parseGitZOutput = (input?: string) =>
  input ? input.replace(/\u0000$/, "").split("\u0000") : [];
/**
 * 获取工作区和暂存区和上一次提交之间差异的文件
 * @param {*} param0
 * @returns
 */
const getChangeFiles = async (cwd = process.cwd()) => {
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

/**
 * 获取暂存区和上一次提交之间差异的文件
 * @param {*} param0
 * @returns
 */
const getStagedFiles = async (cwd = process.cwd()) => {
  try {
    const outputBuffer = execSync("git diff --cached --name-only -z", {
      cwd,
    });
    const lines = outputBuffer.toString();
    if (!lines) {
      return [];
    }
    return parseGitZOutput(lines).map((file) => path.resolve(cwd, file));
  } catch (e) {
    return [];
  }
};

/**
 * 获取待 merge 的文件列表
 * @param {*} cwd
 * @returns
 */
const getMergeFiles = async (
  targetBranch: string,
  cwd: any = process.cwd(),
) => {
  try {
    const outputBuffer = execSync(
      `git diff ${targetBranch} --merge-base --name-only -z`,
      {
        cwd,
      },
    );
    const lines = outputBuffer.toString();
    if (!lines) {
      return [];
    }
    return parseGitZOutput(lines).map((file) => path.resolve(cwd, file));
  } catch (e) {
    console.log();
    return [];
  }
};

/**
 * 获取本次提交发生变更的包
 */
const getPackagesChanged = (
  changedFiles: string[],
  allPackages: { name: string; path: string }[],
) => {
  // 存储每个 package 对应的修改文件列表
  const pkgMap = {};
  for (const pkg of allPackages) {
    pkgMap[pkg.name] = [];
    for (const file of changedFiles) {
      if (file.includes(pkg.path)) {
        pkgMap[pkg.name].push(file);
      }
    }
  }
  // console.log(JSON.stringify(pkgMap, null, 2));
  return Object.entries(pkgMap)
    .filter(([_, list]) => {
      if (list.length === 0) {
        return false;
      }
      // 当仅发生 CHANGELOG 和 package.json 文件修改时，为 changeset 文件消费操作，不需要发 changeset
      if (
        list.length === 2 &&
        list.find((ph) => ph.endsWith("CHANGELOG.md")) &&
        list.find((ph) => ph.endsWith("package.json"))
      ) {
        return false;
      }
      return true;
    })
    .map((item) => item[0]);
};

/**
 * 获取所有需要发布的包
 */
const getShouldPublishPackages = () => _packages.filter((p) => p.shouldPublish);

/**
 * 获取差异的文件列表
 * @param {'staged' | 'changed' | 'merge'} diffType diff 类型
 * - staged: 暂存区和上一次提交之间差异的文件
 * - changed: 工作区和暂存区和上一次提交之间差异的文件
 * - merge: 获取本次 MR 提交的所有文件列表
 */
const getDiffFiles = (diffType, targetBranch) => {
  if (diffType === "changed") {
    return getChangeFiles();
  }
  if (diffType === "merge") {
    return getMergeFiles(targetBranch);
  }
  return getStagedFiles();
};

const parseChangesetArgv = () => {
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

/**
 * 获取上一次提交的文件
 * form: https://stackoverflow.com/questions/424071/how-do-i-list-all-the-files-in-a-commit
 * @param {*} param0
 * @returns
 */
const getLastCommitFiles = async (cwd = process.cwd()) => {
  try {
    const lines = await execSync('git show --pretty="" --name-only -z', {
      cwd,
      encoding: "utf8",
    });
    if (!lines) {
      return [];
    }
    return parseGitZOutput(lines).map((file) => path.resolve(cwd, file));
  } catch {
    return [];
  }
};

/**
 * 获取提交时的 message 信息
 */
const getCommitMessages = async () => {
  try {
    // 实际是去读取 .git/COMMIT_EDIT_MSG 文件内容
    const msgs = await readCommitMessages({
      cwd: process.cwd(),
      edit: true,
    });
    return msgs[0].split("\n")[0].trim();
  } catch (error) {
    console.log(error);
    return "chore: auto create changeset";
  }
};

/**
 * 获取JSON文件版本信息
 */
function getSdkInfo(packageJsonPath) {
  const packageJson = fs.readJSONSync(packageJsonPath);
  return { version: packageJson.version, name: packageJson.name };
}

/**
 * 查询指定版本的 npm 包是否存在
 * @param {*} name
 * @param {*} version
 */
function isPackageExisted(sdkName, version) {
  try {
    console.log(`检测 ${sdkName}@${version} 是否存在...`);
    const versionResult = childProcess.execSync(
      `npm view ${sdkName}@${version} version`,
      {
        encoding: "utf8",
      },
    );
    if (versionResult) {
      console.log(`${sdkName}@${version} 已经存在...请手动修改版本号`);
    }
    // 若存在对应版本的 npm 包，会输出信息
    return Boolean(versionResult);
  } catch (error) {
    // 查询不到指定版本的包信息
    return false;
  }
}

// module.exports = {
//   isPackageExisted,
//   getSdkInfo,
//   getChangeFiles,
//   getStagedFiles,
//   getPackagesChanged,
//   getShouldPublishPackages,
//   getDiffFiles,
//   parseChangesetArgv,
//   getLastCommitFiles,
//   getCommitMessages,
// };

export {
  isPackageExisted,
  getSdkInfo,
  getChangeFiles,
  getStagedFiles,
  getPackagesChanged,
  getShouldPublishPackages,
  getDiffFiles,
  parseChangesetArgv,
  getLastCommitFiles,
  getCommitMessages,
};
