import { getChangesetPackagesAppend, getDifference } from "./changeset";

const runAll = async () => {
  const timestamp = Date.now();
  console.log("开始检测 changeset ");
  const { type: diffType, target: targetBranch } = parseChangesetArgv();
  console.log("diff-info:", {
    diffType,
    targetBranch,
  });
  const commitMsg = await getCommitMessages();
  console.log("commit信息", commitMsg);

  const files = await getDiffFiles(diffType, targetBranch);
  console.log("差异文件", files);
  const allPkgs = getShouldPublishPackages();
  const packagesChanged = getPackagesChanged(files, allPkgs);
  console.log("发生变更的 package", packagesChanged);
  const packagesChangeset = await getChangesetPackagesAppend(files);
  console.log("已发 ac 的 package", packagesChangeset);
  const { increase, decrease } = getDifference(
    packagesChanged,
    packagesChangeset,
  );
  const duration = Date.now() - timestamp;
  console.log(`changeset 卡点检测耗时 ${duration}ms`);
  if (increase.length > 0) {
    console.warn("⚠️ 多发了安装包，暂不卡点", increase);
  }
  if (decrease.length > 0) {
    await execSh(
      `echo "::add-message level=error::❌ 以下安装包出现改动但未创建 changeset 文件:${decrease.join(",")}"`,
    );
    await execSh(
      'echo "::add-message level=info::解决方案：项目根目录执行 npm run ac:all 命令，填写发版信息并生成 changeset 后重新提交到远程分支"',
    );

    process.exit(1);
  }
  console.log("✅ 通过 changeset 卡点");
};

runAll();
