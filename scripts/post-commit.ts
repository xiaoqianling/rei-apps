import { getChangesetPackagesAppend, getDifference } from "./ci/changeset";
import {
  getCommitMessages,
  getLastCommitFiles,
  getPackagesChanged,
  getShouldPublishPackages,
} from "./ci/git-hooks";
import { execSync } from "child_process";
const execSh = require("exec-sh").promise;
const writeChangeset = require("@changesets/write").default;

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;
const escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

/**
 * 为变更的 package 生成 changeset
 * @param {*} msg
 * @param {*} filter
 */
const addChangeset = async (msg = "", pkgNameList) => {
  try {
    const filterArgs = pkgNameList.reduce(
      (prev, cur) => `${prev} --filter ${cur}`,
      "",
    );
    const command = `emo ac --type patch ${filterArgs} --summary ${escapeArg(msg)}`;
    // const changesetID = await writeChangeset(
    //   {
    //     summary: msg,
    //     releases: pkgNameList.map(pkgName => ({
    //       name: pkgName,
    //       type: 'patch'
    //     }))
    //   },
    //   path.join(process.env.ROOT_DIR, 'infra')
    // );
    console.log("execute emo ac command:", command);
    // 命令耗时 3s 左右
    await execSync(command);
    console.log("execute emo ac success, ready commit changeset file");
    await execSh("git add infra/.changeset/*.md", {
      cwd: process.env.ROOT_DIR,
    });
    // 合并新文件到之前的提交，跳过提交检测
    await execSync("CHANGESET=true git commit --amend --no-edit --no-verify");
  } catch (error) {
    console.error(error);
  }
};

async function main() {
  if (process.env.CHANGESET !== undefined) {
    // 生成changeset后 不再执行
    return;
  }

  const timestamp = Date.now();
  // 获取上一次提交的文件
  const lastCommitFiles = await getLastCommitFiles();

  const allPkgs = getShouldPublishPackages();
  const packagesChanged = getPackagesChanged(lastCommitFiles, allPkgs);

  if (packagesChanged.length === 0) {
    console.log(
      `✅ 没有包变更，无需创建 changeset; 耗时: ${Date.now() - timestamp}ms`,
    );
    return;
  }

  console.log("发生变更的 package", packagesChanged);
  const packagesChangeset = await getChangesetPackagesAppend(lastCommitFiles);
  console.log("已发 changeset 的 package", packagesChangeset);
  const { decrease } = getDifference(packagesChanged, packagesChangeset);

  if (decrease.length === 0) {
    console.log("✅ 之前已生成 changeset 文件，无需再处理");
    return;
  }
  console.log("以下包发生变更未生成 changeset 文件，将自动生成", decrease);
  const commitMessage = await getCommitMessages();
  await addChangeset(commitMessage, decrease);
  console.log(`✅ emo ac execute success;  耗时: ${Date.now() - timestamp}ms`);
}

main();
